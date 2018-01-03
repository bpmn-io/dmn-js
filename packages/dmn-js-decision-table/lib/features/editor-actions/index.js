import DecisionTableEditorActions from './DecisionTableEditorActions';
import EditorActions from 'table-js/lib/features/editor-actions';
import Modeling from '../modeling';
import Selection from 'table-js/lib/features/selection';

export default {
  __depends__: [ EditorActions, Modeling, Selection ],
  __init__: [ 'decisionTableEditorActions' ],
  decisionTableEditorActions: [ 'type', DecisionTableEditorActions ]
};