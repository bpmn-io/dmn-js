'use strict';

var createConfig = require('./karma.base');

var path = require('path');

module.exports = createConfig(path.resolve(__dirname));