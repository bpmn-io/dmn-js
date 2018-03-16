import DecisionTableEditorActions from './DecisionTableEditorActions';
import EditorActions from 'table-js/lib/features/editor-actions';
import Selection from 'table-js/lib/features/selection';
import CellSelection from '../cell-selection';

export default {
  __depends__: [
    EditorActions,
    Selection,
    CellSelection
  ],
  __init__: [ 'decisionTableEditorActions' ],
  decisionTableEditorActions: [ 'type', DecisionTableEditorActions ]
};