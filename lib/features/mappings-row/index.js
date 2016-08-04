module.exports = {
  __depends__: [
    require('table-js/lib/features/complex-cell'),
    require('../modeling')
  ],
  __init__: [ 'mappingsRow', 'mappingsRowRenderer' ],
  mappingsRow: [ 'type', require('./MappingsRow') ],
  mappingsRowRenderer: [ 'type', require('./MappingsRowRenderer') ]
};
