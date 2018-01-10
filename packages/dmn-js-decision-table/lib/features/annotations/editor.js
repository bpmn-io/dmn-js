import AnnotationsEditor from './AnnotationsEditor';
import DebounceInput from '../debounce-input';
import Modeling from '../modeling';

export default {
  __depends__: [ DebounceInput, Modeling ],
  __init__: [ 'annotations' ],
  annotations: [ 'type', AnnotationsEditor ]
};