'use strict';

module.exports = {
  __depends__: [
    require('diagram-js/lib/i18n/translate')
  ],
  parseTemplate: [ 'factory', require('./ParseTemplateFactory') ]
};
