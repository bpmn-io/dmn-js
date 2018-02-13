import DebounceInput from '../debounce-input';
import RulesEditor from './RulesEditor';
import Rules from './index';

export default {
  __depends__: [ DebounceInput, Rules ],
  __init__: [ 'rulesEditor' ],
  rulesEditor: [ 'type', RulesEditor ]
};