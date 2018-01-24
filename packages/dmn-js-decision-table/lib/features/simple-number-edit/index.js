import SimpleMode from '../simple-mode';
import SimpleNumberEdit from './SimpleNumberEdit';

export default {
  __depends__: [ SimpleMode ],
  __init__: [ 'simpleNumberEdit' ],
  simpleNumberEdit: [ 'type', SimpleNumberEdit ]
};