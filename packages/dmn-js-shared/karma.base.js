'use strict';

var coverage = process.env.COVERAGE;

var singleStart = process.env.SINGLE_START;

// use puppeteer provided Chrome for testing
process.env.CHROME_BIN = require('puppeteer').executablePath();

// configures browsers to run test against
// any of [ 'ChromeHeadless', 'Chrome', 'Firefox', 'IE' ]
var browsers = (process.env.TEST_BROWSERS || 'ChromeHeadless').split(/\s*,\s*/g);

const testFile = coverage ? 'test/coverageBundle.js' : 'test/testBundle.js';

module.exports = function(path) {

  return function(karma) {

    const config = {

      basePath: path,

      frameworks: [
        'mocha',
        'sinon-chai'
      ],

      files: [
        testFile
      ],

      preprocessors: {
        [testFile]: [ 'webpack', 'env' ]
      },

      reporters: [ 'progress' ].concat(coverage ? 'coverage' : []),

      coverageReporter: {
        reporters: [
          { type: 'lcovonly', subdir: '.' },
        ]
      },

      browsers: browsers,

      browserNoActivityTimeout: 30000,

      singleRun: true,
      autoWatch: false,

      webpack: {
        mode: 'development',
        module: {
          rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              use: 'babel-loader'
            },
            {
              test: /\.css|\.dmn$/,
              use: 'raw-loader'
            }
          ].concat(coverage ?
            {
              test: /\.js$/,
              use: {
                loader: 'istanbul-instrumenter-loader',
                options: { esModules: true }
              },
              enforce: 'post',
              include: /src\.*/,
              exclude: /node_modules/
            } : []
          )
        },
        resolve: {
          mainFields: [
            'dev:module',
            'browser',
            'module',
            'main'
          ],
          modules: [
            'node_modules',
            path
          ]
        },
        devtool: 'eval-source-map'
      }
    };

    if (singleStart) {
      config.browsers = [].concat(config.browsers, 'Debug');
      config.envPreprocessor = [].concat(config.envPreprocessor || [], 'SINGLE_START');
    }

    karma.set(config);
  };

};
