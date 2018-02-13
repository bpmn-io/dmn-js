import DecisionTableHeadEditor from './DecisionTableHeadEditor';
import DebounceInput from '../debounce-input';

export default {
  __depends__: [ DebounceInput ],
  __init__: [ 'decisionTableHeadEditor' ],
  decisionTableHeadEditor: [ 'type', DecisionTableHeadEditor ]
};