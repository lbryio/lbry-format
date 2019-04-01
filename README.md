# LBRY File Format

The LBRY format is a multimedia-format designed to promote interoperability and transmission of complex digital media.  
  
This repo contains some tools & libraries for working with `*.lbry` files.

## CLI Installation

Requires: [NodeJS](https://nodejs.org/en/download/), [Git](https://git-scm.com/downloads)

Windows: `npm i -g https://github.com/lbryio/lbry-format`  
Mac / Linux: `sudo npm i -g https://github.com/lbryio/lbry-format`

Once installed, run `lbry-format --help`

## CLI Usage

`lbry-format pack ./sourceDirectory ./outputPackage.lbry`

## What It's For
A lbry-format file is a compressed web site, much like a zip file.  More specifically, it's a directory of files individually zipped with Zstandard, then collected into a tar archive. 

It is recognized and launched by the LBRY-desktop app to enable rich, interactive media in the client.

When the LBRY desktop app encounters the .lbry extension, and the user presses "play," it decompresses the .lbry file, launches a sandboxed web server in the background, and 'serves up' this file like a real web server might.

This enables a lot of possibilities. To see what is currently possible with this format, check out the LBRY channel [@OpenSourceGames](https://open.lbry.io/@OpenSourceGames#e8fed337dc4ee260f4bcfa6d24ae1e4dd75c2fb3).

There are more restrictions to a .lbry archive than normal websites, because of the security issues and the fact that it's not running on a domain.

## Name

 - Name Format: `*.lbry`
 - Character Set: `UTF-8`
 - Extension: `lbry`

## Metadata

 - Media Type: `application/x-lbry`

## Container

 - Compression: `Zstandard`
 - Archival: `tar`

## Contents

### Descriptor

 - Format: `JSON`, `UTF-8`

# lbry-format

## Requirements

 - Node.js v11.6.0 (see https://nodejs.org/docs/v11.6.0/api/esm.html)

## Usage

**WARNING:** These method signatures will change as the `JSON` `Descriptor` is finalized.

Install `npm i https://github.com/lbryio/lbry-format.git`

### Pack
```
const lbryFormat = require('lbry-format');

// Pack `./` to `package.lbry`
lbryFormat.packDirectory('./', {
  fileName: 'package.lbry',
});

```

### Unpack
```
const lbryFormat = require('lbry-format');

// Unpack `package.lbry` to `./`
lbryFormat.unpackDirectory('./', {
  fileName: 'package.lbry',
});

```
