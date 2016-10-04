module.exports = {
  __depends__: [
    require('table-js/lib/features/complex-cell')
  ],
  __init__: [ 'mappingsRow', 'mappingsRowRenderer' ],
  mappingsRow: [ 'type', require('./MappingsRow') ],
  mappingsRowRenderer: [ 'type', require('./MappingsRowRenderer') ]
};
