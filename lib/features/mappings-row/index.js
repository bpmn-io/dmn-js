module.exports = {
  __init__: [ 'mappingsRow', 'mappingsRowRenderer' ],
  __depends__: [ require('table-js/lib/features/complex-cell') ],
  mappingsRow: [ 'type', require('./MappingsRow') ],
  mappingsRowRenderer: [ 'type', require('./MappingsRowRenderer') ]
};
