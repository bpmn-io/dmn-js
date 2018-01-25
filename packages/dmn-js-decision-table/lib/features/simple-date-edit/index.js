import SimpleMode from '../simple-mode';
import SimpleDateEdit from './SimpleDateEdit';

export default {
  __depends__: [ SimpleMode ],
  __init__: [ 'simpleDateEdit' ],
  simpleDateEdit: [ 'type', SimpleDateEdit ]
};