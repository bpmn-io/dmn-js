import AddRule from './AddRule';
import EditorActions from '../editor-actions';
import PostAddRuleBehavior from './PostAddRuleBehavior';

export default {
  __depends__: [ EditorActions ],
  __init__: [ 'addRule', 'postAddRuleBehavior' ],
  addRule: [ 'type', AddRule ],
  postAddRuleBehavior: [ 'type', PostAddRuleBehavior ]
};