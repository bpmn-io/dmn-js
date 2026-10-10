import SimpleMode from '../simple-mode';
import SimpleDateTimeEdit from './SimpleDateTimeEdit';
import Keyboard from '../keyboard';

export default {
  __depends__: [ Keyboard, SimpleMode ],
  __init__: [ 'simpleDateTimeEdit' ],
  simpleDateTimeEdit: [ 'type', SimpleDateTimeEdit ]
};