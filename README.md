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
