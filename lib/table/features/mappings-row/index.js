module.exports = {
  __depends__: [
    require('diagram-js/lib/i18n/translate'),
    require('table-js/lib/features/complex-cell')
  ],
  __init__: [ 'mappingsRow', 'mappingsRowRenderer' ],
  mappingsRow: [ 'type', require('./MappingsRow') ],
  mappingsRowRenderer: [ 'type', require('./MappingsRowRenderer') ]
};
