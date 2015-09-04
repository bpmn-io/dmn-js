module.exports = {
  __depends__: [
    require('../features/factory')
  ],
  dmnImporter: [ 'type', require('./DmnImporter') ]
};
