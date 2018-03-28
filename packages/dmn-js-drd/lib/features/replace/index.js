import DiagramReplace from 'diagram-js/lib/features/replace';
import DiagramSelection from 'diagram-js/lib/features/selection';

import DrdReplace from './DrdReplace';

export default {
  __depends__: [
    DiagramReplace,
    DiagramSelection
  ],
  drdReplace: [ 'type', DrdReplace ]
};
