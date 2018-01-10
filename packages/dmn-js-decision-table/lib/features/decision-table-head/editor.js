import DecisionTableHeadEditor from './DecisionTableHeadEditor';
import DebounceInput from '../debounce-input';
import Modeling from '../modeling';

export default {
  __depends__: [ DebounceInput, Modeling ],
  __init__: [ 'decisionTableHeadEditor' ],
  decisionTableHeadEditor: [ 'type', DecisionTableHeadEditor ]
};