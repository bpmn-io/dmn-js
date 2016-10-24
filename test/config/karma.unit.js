'use strict';

var path = require('path');

var basePath = '../../';

var absoluteBasePath = path.resolve(path.join(__dirname, basePath));

module.exports = function(karma) {
  karma.set({

    basePath: basePath,

    frameworks: [
      'browserify',
      'mocha',
      'chai',
      'sinon-chai'
    ],

    files: [
      'test/spec/**/*Spec.js'
    ],

    preprocessors: {
      'test/spec/**/*Spec.js': [ 'browserify' ]
    },

    reporters: [ 'spec' ],

    browsers: [ 'PhantomJS', 'Chrome', 'Firefox' ],

    browserNoActivityTimeout: 30000,
    singleRun: false,
    autoWatch: true,

    // browserify configuration
    browserify: {
      debug: true,
      paths: [ absoluteBasePath ]
    }
  });
};
