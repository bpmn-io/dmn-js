import AddInputOutput from './AddInputOutput';
import DecisionTableHead from '../decision-table-head';
import EditorActions from '../editor-actions';

export default {
  __depends__: [ EditorActions, DecisionTableHead ],
  __init__: [ 'addInputOutput' ],
  addInputOutput: [ 'type', AddInputOutput ]
};