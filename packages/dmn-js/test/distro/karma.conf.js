// configures browsers to run test against
// any of [ 'ChromeHeadless', 'Chrome', 'Firefox' ]
var browsers = (process.env.TEST_BROWSERS || 'ChromeHeadless').split(',');

// use puppeteer provided Chrome for testing
process.env.CHROME_BIN = require('puppeteer').executablePath();

var VARIANT = process.env.VARIANT;

var NODE_ENV = process.env.NODE_ENV;

var NAME_SUFFIX = (NODE_ENV === 'production' ? 'production.min' : 'development');

var basePath = '../..';

var suite = 'test/distro/' + VARIANT + '.js';


module.exports = function(karma) {
  karma.set({

    basePath,

    frameworks: [
      'webpack',
      'mocha'
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
      'dist/assets/dmn-js-boxed-expression.css',
      { pattern: 'test/distro/diagram.dmn', included: false },
      { pattern: 'dist/assets/**/*', included: false },
      suite
    ],

    preprocessors: {
      [ suite ]: [ 'webpack' ]
    },

    reporters: [ 'progress' ],

    browsers: browsers,

    browserNoActivityTimeout: 30000,

    singleRun: true,
    autoWatch: false,

    webpack: {
      mode: 'development',
      devtool: 'eval-source-map'
    }
  });

};
