'use strict';

module.exports = {
  __depends__: [
    require('diagram-js/lib/i18n/translate'),
    require('diagram-js/lib/features/keyboard')
  ],
  __init__: [ 'drdKeyBindings' ],
  drdKeyBindings: [ 'type', require('./DrdKeyBindings') ]
};
