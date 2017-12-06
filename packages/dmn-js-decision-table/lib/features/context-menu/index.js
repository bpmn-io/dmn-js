import ContextMenu from './ContextMenu';

export default {
  __depends__: [ 'cutPaste', 'editorActions' ],
  __init__: [ 'decisionTableContextMenu' ],
  decisionTableContextMenu: [ 'type', ContextMenu ]
};