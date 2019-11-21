import DebounceInput from 'dmn-js-shared/lib/features/debounce-input';
import DecisionRulesEditor from './DecisionRulesEditor';
import Rules from './index';
import Translate from 'diagram-js/lib/i18n/translate';

export default {
  __depends__: [ DebounceInput, Rules, Translate ],
  __init__: [ 'decisionRulesEditor' ],
  decisionRulesEditor: [ 'type', DecisionRulesEditor ]
};