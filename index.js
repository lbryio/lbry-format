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
      walkAndRun(runCommand, currentPath);
    } else {
      runCommand(currentPath);
    }
  }
};

async function packDirectory(directory, options = {}) {
  const packRoot = directory;
  const fileWriteStream = getFileWriteStream(options);
  const zstd = await getZstd();

  tarPack.pipe(fileWriteStream);
  writeFirstEntry(options, tarPack);

  walkAndRun(async (file) => {
    let contents = await readFile(file);

    contents = new Uint8Array(contents);

    // Must be chunked to avoid issues with fixed memory limits.
    const chunkIterator = (() => {
      const chunkSize = 4096;
      let position = 0;

      const iterator = {
        next: function() {
          const endIndex = position + chunkSize;
          const result = {
            value: contents.slice(position, endIndex),
            done: endIndex >= contents.length,
          };

          position = endIndex;
          return result;
        },
        [Symbol.iterator]: function() { return this }
      };
      return iterator;
    })();

    contents = zstd.compressChunks(chunkIterator, contents.length, COMPRESSION_LEVEL);

    let name = path.relative(packRoot, file);

    if(/^\.\//.test(name)) {
      name = name.slice(2);
    }

    const entry = tarPack.entry({ name, size: contents.length }, (err) => {
      if(err) {
        throw err;
      }
    });

    entry.end(contents);
  }, directory, packRoot);
};

async function unpackDirectory(directory, options = {}) {
  if(!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }

  const fileReadStream = getFileReadStream(options);
  const zstd = await getZstd();

  const extract = tar.extract();

  extract.on('entry', async (header, fileStream, next) => {
    fileStream.on('end', () => {
      next();
    })

    if(!/^\./.test(header.name)) {
      const writePath = path.join(directory, header.name);
      await fs.promises.mkdir(path.dirname(writePath), { recursive: true });
      var fileWriteStream = fs.createWriteStream(writePath);
      fileStream.pipe(fileWriteStream);
    } else {
      // Just drain it
      fileStream.resume();
    }
  });

  extract.on('finish', () => {
    // all entries read
  });

  fileReadStream.pipe(extract);
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
