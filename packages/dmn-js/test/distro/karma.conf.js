// configures browsers to run test against
// any of [ 'ChromeHeadless', 'Chrome', 'Firefox', 'IE' ]
var browsers =
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
    });


var VARIANT = process.env.VARIANT;

var NODE_ENV = process.env.NODE_ENV;

var NAME_SUFFIX = (NODE_ENV === 'production' ? 'production.min' : 'development');

module.exports = function(karma) {
  karma.set({

    basePath: '../../',

    frameworks: [
      'mocha',
      'sinon-chai'
    ],

    files: [
      'dist/' + VARIANT + '.' + NAME_SUFFIX + '.js',
      'dist/assets/dmn-font/css/dmn.css',
      'dist/assets/diagram-js.css',
      'dist/assets/dmn-js-shared.css',
      'dist/assets/dmn-js-decision-table-controls.css',
      'dist/assets/dmn-js-decision-table.css',
      'dist/assets/dmn-js-drd.css',
      'dist/assets/dmn-js-literal-expression.css',
      { pattern: 'test/distro/diagram.dmn', included: false },
      { pattern: 'dist/assets/**/*', included: false },
      'test/distro/helper.js',
      'test/distro/' + VARIANT + '.js'
    ],

    reporters: [ 'progress' ],

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

    browsers: browsers,

    browserNoActivityTimeout: 30000,

    singleRun: true,
    autoWatch: false
  });

};
