**PROPOSAL STAGE**

# LBRY File Format

The LBRY format is a multimedia-format designed to promote interoperability and transmission of complex digital media.

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
