import DecisionTablePropertiesEditor from './DecisionTablePropertiesEditor';
import DebounceInput from '../debounce-input';
import Modeling from '../modeling';

export default {
  __depends__: [ DebounceInput, Modeling ],
  __init__: [ 'decisionTableProperties' ],
  decisionTableProperties: [ 'type', DecisionTablePropertiesEditor ]
};