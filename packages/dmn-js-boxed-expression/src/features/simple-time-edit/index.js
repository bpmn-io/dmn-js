import SimpleMode from '../simple-mode';
import SimpleTimeEdit from './SimpleTimeEdit';
import Keyboard from '../keyboard';

export default {
  __depends__: [ Keyboard, SimpleMode ],
  __init__: [ 'simpleTimeEdit' ],
  simpleTimeEdit: [ 'type', SimpleTimeEdit ]
};