'use strict';

var TestHelper = module.exports = require('./helper');

TestHelper.insertCSS('dmn-js.css', require('../../assets/css/dmn-js.css'));

TestHelper.insertCSS('diagram-js.css', require('../../node_modules/diagram-js/assets/diagram-js.css'));

TestHelper.insertCSS('dmn-js-testing.css',
  '.test-container .result { height: 500px; }' + '.test-container > div'
);
