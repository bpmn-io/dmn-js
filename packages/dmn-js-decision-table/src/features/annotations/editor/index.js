import AnnotationsEditingProvider from './AnnotationsEditingProvider';
import DebounceInput from 'dmn-js-shared/lib/features/debounce-input';
import Translate from 'diagram-js/lib/i18n/translate';

export default {
  __depends__: [ DebounceInput, Translate ],
  __init__: [ 'annotationsProvider' ],
  annotationsProvider: [ 'type', AnnotationsEditingProvider ]
};