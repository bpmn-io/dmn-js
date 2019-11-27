import ExpressionLanguagesModule from 'dmn-js-shared/lib/features/expression-languages';

import DecisionRules from './DecisionRules';

export default {
  __depends__: [
    ExpressionLanguagesModule
  ],
  __init__: [ 'decisionRules' ],
  decisionRules: [ 'type', DecisionRules ]
};