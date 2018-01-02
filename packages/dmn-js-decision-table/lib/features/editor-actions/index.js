import DecisionTableEditorActions from './DecisionTableEditorActions';
import EditorActions from 'table-js/lib/features/editor-actions';

export default {
  __depends__: [ EditorActions ],
  __init__: [ 'decisionTableEditorActions' ],
  decisionTableEditorActions: [ 'type', DecisionTableEditorActions ]
};