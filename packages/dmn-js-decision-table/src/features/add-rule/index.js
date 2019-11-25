import AddRule from './AddRule';
import EditorActions from '../editor-actions';

export default {
  __depends__: [ EditorActions, 'translate' ],
  __init__: [ 'addRule' ],
  addRule: [ 'type', AddRule ]
};