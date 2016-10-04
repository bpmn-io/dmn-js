module.exports = {
  __depends__: [
    require('../features/factory')
  ],
  tableImporter: [ 'type', require('./TableImporter') ]
};
