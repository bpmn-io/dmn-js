import DecisionPropertiesEditor from './DecisionPropertiesEditor';
import Modeling from '../modeling';
import DebounceInput from 'dmn-js-decision-table/lib/features/debounce-input';

export default {
  __depends__: [ DebounceInput, Modeling ],
  __init__: [ 'decisionProperties' ],
  decisionProperties: [ 'type', DecisionPropertiesEditor ]
};