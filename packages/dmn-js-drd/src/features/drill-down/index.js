import OverlaysModule from 'diagram-js/lib/features/overlays';

import DrillDown from './DrillDown';

export default {
  __depends__: [
    OverlaysModule
  ],
  __init__: [ 'drillDown' ],
  drillDown: [ 'type', DrillDown ]
};
