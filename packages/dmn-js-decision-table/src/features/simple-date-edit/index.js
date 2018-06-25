import SimpleMode from '../simple-mode';
import SimpleDateEdit from './SimpleDateEdit';
import Keyboard from '../keyboard';

export default {
  __depends__: [ Keyboard, SimpleMode ],
  __init__: [ 'simpleDateEdit' ],
  simpleDateEdit: [ 'type', SimpleDateEdit ]
};