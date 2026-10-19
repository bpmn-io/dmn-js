import SimpleMode from '../simple-mode';
import SimpleBooleanEdit from './SimpleBooleanEdit';
import Keyboard from '../keyboard';

export default {
  __depends__: [ Keyboard, SimpleMode ],
  __init__: [ 'simpleBooleanEdit' ],
  simpleBooleanEdit: [ 'type', SimpleBooleanEdit ]
};