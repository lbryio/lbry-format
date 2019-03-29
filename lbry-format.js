#!/usr/bin/env node
const {
	packDirectory,
  unpackDirectory,
} = require('lbry-format');
const path = require('path');

require('yargs')
  .scriptName('lbry-pack')
  .usage('$0 <cmd> [args]')
  .command('pack [directory] [file]', 'Pack a directory', (yargs) => {
    yargs.positional('directory', {
      default: './src',
      describe: 'The source directory to pack'
    }).positional('file', {
      describe: 'Output file',
      default: './package.lbry',
    })
  }, function (argv) {
    console.log(`Packing ${argv.directory} to ${argv.file}`);

    const resolvedDirectory = path.resolve(argv.directory);
    const resolvedfile = path.resolve(argv.file);

    packDirectory(resolvedDirectory, {
    	fileName: resolvedfile,
    });
  })
  .command('unpack [directory] [file]', 'Unpack a file', (yargs) => {
    yargs.positional('destination', {
      type: 'string',
      default: './src',
      describe: 'The folder destination to unpack to'
    }).positional('file', {
      describe: 'Input filename',
      default: 'package.lbry',
    })
  }, function (argv) {
    console.log(`Packing ${argv.directory} to ${argv.file}`);


    const resolvedDirectory = path.resolve(argv.directory);
    const resolvedfile = path.resolve(argv.file);

    unpackDirectory(resolvedDirectory, {
    	fileName: resolvedfile,
    });
  })
  .help()
  .demandCommand()
  .argv
