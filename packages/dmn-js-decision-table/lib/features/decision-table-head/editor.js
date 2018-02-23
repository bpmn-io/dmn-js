import DecisionTableHeadEditor from './DecisionTableHeadEditor';
import DebounceInput from 'dmn-js-shared/lib/features/debounce-input';

export default {
  __depends__: [ DebounceInput ],
  __init__: [ 'decisionTableHeadEditor' ],
  decisionTableHeadEditor: [ 'type', DecisionTableHeadEditor ]
};