import AnnotationsEditor from './AnnotationsEditor';
import DebounceInput from '../../util/debounceInput';
import Modeling from '../modeling';

export default {
  __depends__: [ DebounceInput, Modeling ],
  __init__: [ 'annotations' ],
  annotations: [ 'type', AnnotationsEditor ]
};