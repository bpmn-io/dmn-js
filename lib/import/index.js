'use strict';

module.exports = {
  __depends__: [
    require('diagram-js/lib/i18n/translate')
  ],
  drdImporter: [ 'type', require('./DrdImporter') ]
};
