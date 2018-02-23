import DecisionTablePropertiesEditor from './DecisionTablePropertiesEditor';
import DebounceInput from 'dmn-js-shared/lib/features/debounce-input';

export default {
  __depends__: [ DebounceInput ],
  __init__: [ 'decisionTableProperties' ],
  decisionTableProperties: [ 'type', DecisionTablePropertiesEditor ]
};