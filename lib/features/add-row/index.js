module.exports = {
  __init__: [ 'dmnAddRow' ],
  __depends__: [
    require('table-js/lib/features/add-row')
  ],
  dmnAddRow: [ 'type', require('./AddRow') ]
};
