module.exports = {
  __init__: [
    'createConnectionBehavior',
    'replaceConnectionBehavior'
  ],
  createConnectionBehavior: [ 'type', require('./CreateConnectionBehavior') ],
  replaceConnectionBehavior: [ 'type', require('./ReplaceConnectionBehavior') ]
};
