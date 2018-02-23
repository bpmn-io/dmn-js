import DebounceInput from 'dmn-js-shared/lib/features/debounce-input';
import RulesEditor from './RulesEditor';
import Rules from './index';

export default {
  __depends__: [ DebounceInput, Rules ],
  __init__: [ 'rulesEditor' ],
  rulesEditor: [ 'type', RulesEditor ]
};