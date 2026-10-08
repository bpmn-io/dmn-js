import DraggingModule from 'diagram-js/lib/features/dragging';

import DecisionServiceDivider from './DecisionServiceDivider';

export default {
  __depends__: [ DraggingModule ],
  __init__: [ 'decisionServiceDivider' ],
  decisionServiceDivider: [ 'type', DecisionServiceDivider ]
};