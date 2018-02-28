import ContextMenu from './ContextMenu';
import CutPaste from 'table-js/lib/features/cut-paste';
import EditorActions from '../editor-actions';
import TableContextMenu from 'table-js/lib/features/context-menu';
import ModelingRules from '../rules';

export default {
  __depends__: [ CutPaste, EditorActions, TableContextMenu, ModelingRules ],
  __init__: [ 'decisionTableContextMenu' ],
  decisionTableContextMenu: [ 'type', ContextMenu ]
};