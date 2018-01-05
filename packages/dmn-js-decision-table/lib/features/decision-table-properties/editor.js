import DecisionTablePropertiesEditor from './DecisionTablePropertiesEditor';
import Modeling from '../modeling';

export default {
  __depends__: [ Modeling ],
  __init__: [ 'decisionTableProperties' ],
  decisionTableProperties: [ 'type', DecisionTablePropertiesEditor ]
};