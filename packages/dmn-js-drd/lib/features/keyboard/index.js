import DiagramKeyboard from 'diagram-js/lib/features/keyboard';

import DrdKeyBindings from './DrdKeyBindings';

export default {
  __depends__: [
    DiagramKeyboard
  ],
  __init__: [ 'drdKeyBindings' ],
  drdKeyBindings: [ 'type', DrdKeyBindings ]
};
