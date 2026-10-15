import CellSelection from '../cell-selection';
import CopyCutPaste from '../copy-cut-paste';
import DecisionTableEditorActions from './DecisionTableEditorActions';
import EditorActions from 'table-js/lib/features/editor-actions';
import Selection from 'table-js/lib/features/selection';

export default {
  __depends__: [
    CellSelection,
    CopyCutPaste,
    EditorActions,
    Selection
  ],
  __init__: [ 'decisionTableEditorActions' ],
  decisionTableEditorActions: [ 'type', DecisionTableEditorActions ]
};