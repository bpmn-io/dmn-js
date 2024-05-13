import KeyboardModule from 'diagram-js/lib/features/keyboard';

import { KeyboardBindings } from './KeyboardBindings';

export default {
  __depends__: [
    KeyboardModule
  ],
  __init__: [ 'keyboardBindings' ],
  keyboardBindings: [ 'type', KeyboardBindings ]
};
