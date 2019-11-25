import DecisionRules from './DecisionRules';

export default {
  __depends__: [ 'translate' ],
  __init__: [ 'decisionRules' ],
  decisionRules: [ 'type', DecisionRules ]
};