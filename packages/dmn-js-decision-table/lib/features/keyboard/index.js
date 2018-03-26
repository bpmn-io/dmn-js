import EditorActions from '../editor-actions';
import Keyboard from './Keyboard';
import CellSelection from '../cell-selection';

export default {
  __depends__: [ EditorActions, CellSelection ],
  __init__: [ 'keyboard' ],
  keyboard: [ 'type', Keyboard ]
};