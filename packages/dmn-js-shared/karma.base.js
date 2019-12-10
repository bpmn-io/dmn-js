'use strict';

var coverage = process.env.COVERAGE;

// configures browsers to run test against
// any of [ 'ChromeHeadless', 'Chrome', 'Firefox', 'IE' ]
var browsers = (
  (process.env.TEST_BROWSERS || 'ChromeHeadless')
    .replace(/^\s+|\s+$/, '')
    .split(/\s*,\s*/g)
    .map(function(browser) {
      if (browser === 'ChromeHeadless') {
        process.env.CHROME_BIN = require('puppeteer').executablePath();

        // workaround https://github.com/GoogleChrome/puppeteer/issues/290
        if (process.platform === 'linux') {
          return 'ChromeHeadless_Linux';
        }
      }

      return browser;
    })
);

const testFile = coverage ? 'test/coverageBundle.js' : 'test/testBundle.js';

module.exports = function(path) {

  return function(karma) {
    karma.set({

      basePath: path,

      frameworks: [
        'mocha',
        'sinon-chai'
      ],

      files: [
        testFile
      ],

      preprocessors: {
        [testFile]: [ 'webpack' ]
      },

      customLaunchers: {
        ChromeHeadless_Linux: {
          base: 'ChromeHeadless',
          flags: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
          ],
          debug: true
        }
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
    });
  };

};
