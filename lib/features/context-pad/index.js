'use strict';

module.exports = {
  __depends__: [
    require('diagram-js/lib/i18n/translate'),
    require('diagram-js/lib/features/context-pad'),
    require('diagram-js/lib/features/selection'),
    require('diagram-js/lib/features/connect'),
    require('diagram-js/lib/features/create'),
    require('../popup-menu')
  ],
  __init__: [ 'contextPadProvider' ],
  contextPadProvider: [ 'type', require('./ContextPadProvider') ]
};
