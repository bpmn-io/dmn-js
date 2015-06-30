module.exports = {
  __init__: [ 'contextMenu' ],
  __depends__: [
    require('table-js/lib/features/popup-menu')
  ],
  contextMenu: [ 'type', require('./ContextMenu') ]
};
