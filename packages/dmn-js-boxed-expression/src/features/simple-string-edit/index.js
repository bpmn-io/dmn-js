import SimpleMode from '../simple-mode';
import SimpleStringEdit from './SimpleStringEdit';
import Keyboard from '../keyboard';

export default {
  __depends__: [ Keyboard, SimpleMode ],
  __init__: [ 'simpleStringEdit' ],
  simpleStringEdit: [ 'type', SimpleStringEdit ]
};