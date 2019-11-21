import DecisionRules from './DecisionRules';
import Translate from 'diagram-js/lib/i18n/translate';

export default {
  __depends__: [Translate],
  __init__: [ 'decisionRules' ],
  decisionRules: [ 'type', DecisionRules ]
};