import DebounceInput from '../debounce-input';
import Modeling from '../modeling';
import RulesEditor from './RulesEditor';
import Rules from './index';

export default {
  __depends__: [ DebounceInput, Modeling, Rules ],
  __init__: [ 'rulesEditor' ],
  rulesEditor: [ 'type', RulesEditor ]
};