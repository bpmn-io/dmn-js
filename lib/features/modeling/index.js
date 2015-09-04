module.exports = {
  __init__: [ 'modeling', 'dmnUpdater' ],
  __depends__: [
    require('table-js/lib/features/modeling'),
    require('table-js/lib/features/add-row'),
    require('../factory')
  ],
  modeling: [ 'type', require('./Modeling') ],
  dmnUpdater: [ 'type', require('./DmnUpdater') ],
};
