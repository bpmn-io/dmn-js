'use strict';

var TestHelper = module.exports = require('./helper');

TestHelper.insertCSS('dmn-js-drd.css', require('../assets/css/dmn-js-drd.css'));

TestHelper.insertCSS('diagram-js.css', require('diagram-js/assets/diagram-js.css'));

TestHelper.insertCSS('dmn-js-testing.css',
  '.test-container .dmn-js-parent { height: 500px; }'
);