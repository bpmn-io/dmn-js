module.exports = {
  __init__: [ 'dmnEditorActions' ],
  __depends__: [
    require('diagram-js/lib/i18n/translate')
  ],
  dmnEditorActions: [ 'type', require('./DmnEditorActions') ]
};
