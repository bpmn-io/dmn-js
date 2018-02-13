import AnnotationsEditor from './AnnotationsEditor';
import DebounceInput from '../debounce-input';

export default {
  __depends__: [ DebounceInput ],
  __init__: [ 'annotations' ],
  annotations: [ 'type', AnnotationsEditor ]
};