import EditorActions from '../editor-actions';

import Keyboard from './Keyboard';


export default {
  __depends__: [
    EditorActions
  ],
  __init__: [
    'keyboard'
  ],
  keyboard: [ 'type', Keyboard ]
};