import SimpleMode from '../simple-mode';
import SimpleNumberEdit from './SimpleNumberEdit';
import Keyboard from '../keyboard';

export default {
  __depends__: [ Keyboard, SimpleMode ],
  __init__: [ 'simpleNumberEdit' ],
  simpleNumberEdit: [ 'type', SimpleNumberEdit ]
};