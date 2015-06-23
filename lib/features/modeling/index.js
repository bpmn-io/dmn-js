module.exports = {
  __init__: [ 'modeling', 'dmnUpdater' ],
  __depends__: [
    require('table-js/lib/features/modeling'),
    require('table-js/lib/features/add-row')
  ],
  dmnFactory: [ 'type', require('./DmnFactory') ],
  modeling: [ 'type', require('./Modeling') ],
  dmnUpdater: [ 'type', require('./DmnUpdater') ],
  elementFactory: [ 'type', require('./ElementFactory') ]
};
