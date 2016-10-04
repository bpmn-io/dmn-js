module.exports = {
  __init__: [ 'typeRow', 'typeRowRenderer' ],
  __depends__: [ require('table-js/lib/features/complex-cell') ],
  typeRow: [ 'type', require('./TypeRow') ],
  typeRowRenderer: [ 'type', require('./TypeRowRenderer') ]
};
