module.exports = {
  __init__: [ 'modeling', 'tableUpdater' ],
  __depends__: [
    require('table-js/lib/features/modeling'),
    require('table-js/lib/features/add-row'),
    require('../factory')
  ],
  modeling: [ 'type', require('./Modeling') ],
  tableUpdater: [ 'type', require('./TableUpdater') ]
};
