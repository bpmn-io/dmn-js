module.exports = {
  __init__: [ 'modeling', 'tableUpdater' ],
  __depends__: [
    require('diagram-js/lib/i18n/translate'),
    require('table-js/lib/features/modeling'),
    require('table-js/lib/features/add-row'),
    require('../factory')
  ],
  modeling: [ 'type', require('./Modeling') ],
  tableUpdater: [ 'type', require('./TableUpdater') ]
};
