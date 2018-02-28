import DecisionTableModelingRules from './DecisionTableModelingRules';
import Rules from 'table-js/lib/features/rules';

export default {
  __depends__: [ Rules ],
  __init__: [ 'decisionTableModelingRules' ],
  decisionTableModelingRules: [ 'type', DecisionTableModelingRules ]
};