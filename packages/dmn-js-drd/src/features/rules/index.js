import DiagramRulesModule from 'diagram-js/lib/features/rules';

import DrdRules from './DrdRules';

export default {
  __depends__: [
    DiagramRulesModule
  ],
  __init__: [ 'drdRules' ],
  drdRules: [ 'type', DrdRules ]
};
