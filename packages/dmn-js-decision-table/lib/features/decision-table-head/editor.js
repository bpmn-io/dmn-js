import DecisionTableHeadEditor from './DecisionTableHeadEditor';
import DebounceInput from '../../util/debounceInput';
import Modeling from '../modeling';

export default {
  __depends__: [ DebounceInput, Modeling ],
  __init__: [ 'decisionTableHeadEditor' ],
  decisionTableHeadEditor: [ 'type', DecisionTableHeadEditor ]
};