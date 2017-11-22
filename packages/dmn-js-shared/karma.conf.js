'use strict';

// configures browsers to run test against
// any of [ 'ChromeHeadless', 'Chrome', 'Firefox', 'IE', 'PhantomJS' ]
var browsers = (
  (process.env.TEST_BROWSERS || 'PhantomJS')
    .replace(/^\s+|\s+$/, '')
    .split(/\s*,\s*/g)
    .map(function(browser) {
      if (browser === 'ChromeHeadless') {
        process.env.CHROME_BIN = require('puppeteer').executablePath();

        // workaround https://github.com/GoogleChrome/puppeteer/issues/290
        if (process.platform === 'linux') {
          return 'ChromeHeadless_Linux';
        }
      } else {
        return browser;
      }
    })
);


module.exports = function(path) {

  return function(karma) {
    karma.set({

      basePath: path,

      frameworks: [
        'mocha',
        'sinon-chai',
        'source-map-support',
        'browserify'
      ],

      files: [
        require.resolve('babel-polyfill/dist/polyfill'),
        'test/**/*Spec.js'
      ],

      preprocessors: {
        'test/**/*Spec.js': [ 'browserify' ]
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

      reporters: [ 'spec' ],

      browsers: browsers,

      singleRun: true,
      autoWatch: false,

      // browserify configuration
      browserify: {
        debug: true,
        paths: [ path ],
        transform: [
          [ 'babelify', {
            global: true,
            sourceMapsAbsolute: true
          } ],
          [ 'stringify', {
            global: true,
            extensions: [
              '.dmn',
              '.html',
              '.css'
            ]
          } ]
        ]
      }
    });
  };

};
