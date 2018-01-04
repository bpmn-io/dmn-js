import AnnotationsEditor from './AnnotationsEditor';
import Modeling from '../modeling';

export default {
  __depends__: [ Modeling ],
  __init__: [ 'annotations' ],
  annotations: [ 'type', AnnotationsEditor ]
};