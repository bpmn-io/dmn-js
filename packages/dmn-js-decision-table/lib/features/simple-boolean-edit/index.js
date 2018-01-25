import SimpleMode from '../simple-mode';
import SimpleBooleanEdit from './SimpleBooleanEdit';

export default {
  __depends__: [ SimpleMode ],
  __init__: [ 'simpleBooleanEdit' ],
  simpleBooleanEdit: [ 'type', SimpleBooleanEdit ]
};