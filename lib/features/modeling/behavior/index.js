module.exports = {
  __init__: [
    'createConnectionBehavior',
    'replaceConnectionBehavior',
    'replaceElementBehavior'
  ],
  createConnectionBehavior: [ 'type', require('./CreateConnectionBehavior') ],
  replaceConnectionBehavior: [ 'type', require('./ReplaceConnectionBehavior') ],
  replaceElementBehavior: [ 'type', require('./ReplaceElementBehavior') ]
};
