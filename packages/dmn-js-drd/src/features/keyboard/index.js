import KeyboardModule from 'diagram-js/lib/features/keyboard';

import DrdKeyboardBindings from './DrdKeyboardBindings';

export default {
  __depends__: [
    KeyboardModule
  ],
  __init__: [ 'keyboardBindings' ],
  keyboardBindings: [ 'type', DrdKeyboardBindings ]
};
