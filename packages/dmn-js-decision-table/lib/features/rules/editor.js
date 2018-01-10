import DebounceInput from '../debounce-input';
import Modeling from '../modeling';
import RulesEditor from './RulesEditor';

export default {
  __depends__: [ DebounceInput, Modeling ],
  __init__: [ 'rulesEditor' ],
  rulesEditor: [ 'type', RulesEditor ]
};