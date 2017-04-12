module.exports = {
  __init__: [ 'contextMenu' ],
  __depends__: [
    require('diagram-js/lib/i18n/translate'),
    require('table-js/lib/features/popup-menu')
  ],
  contextMenu: [ 'type', require('./ContextMenu') ]
};
