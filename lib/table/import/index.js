module.exports = {
  __depends__: [
    require('../features/factory'),
    require('diagram-js/lib/i18n/translate')
  ],
  tableImporter: [ 'type', require('./TableImporter') ]
};
