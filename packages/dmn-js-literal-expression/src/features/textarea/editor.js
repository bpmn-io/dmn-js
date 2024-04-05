import TranslateModule from 'diagram-js/lib/i18n/translate';
import DebounceInput from 'dmn-js-shared/lib/features/debounce-input';

import TextareaEditor from './TextareaEditor';

export default {
  __depends__: [
    DebounceInput,
    TranslateModule
  ],
  __init__: [ 'textarea' ],
  textarea: [ 'type', TextareaEditor ]
};