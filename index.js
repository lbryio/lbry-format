const fs = require('fs');
const path = require('path');
const tar = require('tar-stream');
const tarPack = tar.pack();
const ZstdCodec = require('zstd-codec').ZstdCodec;
const util = require('util');

const COMPRESSION_LEVEL = 5;

// async readdir
const readdir = async (path, options) => {
  return new Promise((resolve) => {
    fs.readdir(path, options, (err, files) => {
      if(err) {
        throw err;
      }
      resolve(files);
    })
  })
};

// async readFile
const readFile = util.promisify(fs.readFile);

function generateFirstEntry(options) {
  return '{}';
}

function writeFirstEntry(options, tarPack) {
  tarPack.entry({ name: '.' }, generateFirstEntry(options), (err) => {
    if(err) {
      throw err;
    }
  });
}

function getFileReadStream(options) {
  const fileName = options.fileName || 'package.lbry';
  return fs.createReadStream(fileName);
}

function getFileWriteStream(options) {
  const fileName = options.fileName || 'package.lbry';
  return fs.createWriteStream(fileName);
}

async function getZstd() {
  return new Promise((resolve, reject) => {
    try {
      ZstdCodec.run(zstd => {
        const Streaming = new zstd.Streaming();
        resolve(Streaming);
      });
    } catch(e) {
      reject(e);
    }
  })
}

async function walkAndRun(runCommand, dir, root) {
  let files = await readdir(dir);

  for(let file of files) {
    const currentPath = path.join(dir, file);

    if (fs.statSync(currentPath).isDirectory()) {
      await walkAndRun(runCommand, currentPath);
    } else {
      await runCommand(currentPath);
    }
  }
};

async function writeStream(stream, data) {
  return new Promise((resolve) => {
    stream.write(data);
    stream.end(resolve)
  });
}

async function packDirectory(directory, options = {}) {
  const zstd = await getZstd();
  const packRoot = directory;
  const fileWriteStream = getFileWriteStream(options);

  tarPack.pipe(fileWriteStream);
  writeFirstEntry(options, tarPack);

  await walkAndRun(async (file) => {
    contents = await readFile(path.normalize(file));

    // Must be chunked to avoid issues with fixed memory limits.
    const chunkIterator = (() => {
      const chunkSize = 2048;
      let position = 0;

      const iterator = {
        next: function() {
          const endIndex = position + chunkSize;
          const result = {
            value: contents.slice(position, endIndex),
            done: position >= contents.length,
          };

          position = endIndex;
          return result;
        },
        [Symbol.iterator]: function() { return this }
      };
      return iterator;
    })();

    contents = zstd.compressChunks(chunkIterator, contents.length, COMPRESSION_LEVEL);

    let name = path.relative(packRoot, file).replace('\\', '/');

    if(/^\.\//.test(name)) {
      name = name.slice(2);
    }

    const entry = tarPack.entry({ name, size: contents.length }, (err) => {
      if(err) {
        throw err;
      }
    });

    await writeStream(entry, contents);

    entry.end();
  }, directory, packRoot);
  tarPack.finalize();
};


function strToBuffer (string) {
  let arrayBuffer = new ArrayBuffer(string.length * 1);
  let newUint = new Uint8Array(arrayBuffer);
  newUint.forEach((_, i) => {
    newUint[i] = string.charCodeAt(i);
  });
  return newUint;
}

function streamToBuffer(stream) {
  const chunks = []
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks)))
  })
}


async function unpackDirectory(directory, options = {}) {
  return new Promise(async (resolve) => {
    if(!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }

    const fileReadStream = getFileReadStream(options);
    const zstd = await getZstd();

    const extract = tar.extract();

    extract.on('entry', async (header, fileStream, next) => {
      let contents = await streamToBuffer(fileStream);
      contents = new Uint8Array(contents);

      contents = zstd.decompress(contents);

      if(!/^\./.test(header.name)) {
        const writePath = path.join(directory, header.name);

        try {
          fs.mkdirSync(path.dirname(writePath), { recursive: true });
        } catch (e) {
          // Directory exists
        }
        const fileWriteStream = fs.createWriteStream(writePath);
        fileWriteStream.write(contents);
        fileWriteStream.end();
        next();
      } else {
        fileStream.resume();
        next();
      }
    });

    extract.on('finish', () => {
      resolve(true);
    });

    fileReadStream.pipe(extract);
  });
}

/*
// DO NOT USE until converted to use `compressChunks`
async function packPaths(root, pathsArray, options = {}) {
  const fileWriteStream = getFileWriteStream(options);
  const zstd = await getZstd();

  tarPack.pipe(fileWriteStream);
  writeFirstEntry(options, tarPack);

  for(let name of pathsArray) {
    let contents = await readFile(path.join(root, name));

    contents = new Uint8Array(contents);
    contents = zstd.compress(contents, COMPRESSION_LEVEL);

    if(/^\.\//.test(name)) {
      name = name.slice(2);
    }

    const entry = tarPack.entry({ name, size: contents.length }, (err) => {
      if(err) {
        throw err;
      }
    });

    entry.end(contents);
  }
  tarPack.finalize();
}
*/

module.exports = {
  packDirectory,
  unpackDirectory,
}
