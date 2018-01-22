import SimpleMode from '../simple-mode';
import SimpleStringEdit from './SimpleStringEdit';

export default {
  __depends__: [ SimpleMode ],
  __init__: [ 'simpleStringEdit' ],
  simpleStringEdit: [ 'type', SimpleStringEdit ]
};