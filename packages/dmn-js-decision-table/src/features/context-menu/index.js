import ContextMenu from './ContextMenu';
import EditorActions from '../editor-actions';
import TableContextMenu from 'table-js/lib/features/context-menu';
import ModelingRules from '../rules';
import ContextMenuCloseBehavior from './ContextMenuCloseBehavior';
import ContextMenuKeyboard from './ContextMenuKeyboard';

export default {
  __depends__: [ EditorActions, TableContextMenu, ModelingRules ],
  __init__: [
    'decisionTableContextMenu',
    'contextMenuCloseBehavior',
    'contextMenuKeyboard'
  ],
  decisionTableContextMenu: [ 'type', ContextMenu ],
  contextMenuCloseBehavior: [ 'type', ContextMenuCloseBehavior ],
  contextMenuKeyboard: [ 'type', ContextMenuKeyboard ]
};