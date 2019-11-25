import AnnotationsEditingProvider from './AnnotationsEditingProvider';
import DebounceInput from 'dmn-js-shared/lib/features/debounce-input';

export default {
  __depends__: [ DebounceInput, 'translate' ],
  __init__: [ 'annotationsProvider' ],
  annotationsProvider: [ 'type', AnnotationsEditingProvider ]
};