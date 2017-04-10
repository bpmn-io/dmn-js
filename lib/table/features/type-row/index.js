module.exports = {
  __init__: [ 'typeRow', 'typeRowRenderer' ],
  __depends__: [
    require('diagram-js/lib/i18n/translate'),
    require('../../../features/templates'),
    require('table-js/lib/features/complex-cell')
  ],
  typeRow: [ 'type', require('./TypeRow') ],
  typeRowRenderer: [ 'type', require('./TypeRowRenderer') ]
};
