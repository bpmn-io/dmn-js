'use strict';

var TestHelper = module.exports = require('./helper');

TestHelper.insertCSS('dmn-js.css', require('../../../assets/css/dmn-js.css'));

TestHelper.insertCSS('dmn-js-testing.css',
  '.test-container .result { height: 500px; }' + '.test-container > div'
);
