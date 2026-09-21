import DraggingModule from 'diagram-js/lib/features/dragging';
import GridSnappingModule from 'diagram-js/lib/features/grid-snapping';

import DecisionServiceDivider from './DecisionServiceDivider';

export default {
  __depends__: [ DraggingModule, GridSnappingModule ],
  __init__: [ 'decisionServiceDivider' ],
  decisionServiceDivider: [ 'type', DecisionServiceDivider ]
};
