import DecisionPropertiesEditor from './DecisionPropertiesEditor';
import DebounceInput from 'dmn-js-shared/lib/features/debounce-input';

export default {
  __depends__: [ DebounceInput ],
  __init__: [ 'decisionProperties' ],
  decisionProperties: [ 'type', DecisionPropertiesEditor ]
};