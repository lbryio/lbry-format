const lbryFormat = require('../index');

// should be run from package root directory
lbryFormat.packDirectory('./examples/src', {
  fileName: './examples/template-pack.lbry',
  useTemplate: true,
});
