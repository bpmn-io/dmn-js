import TextareaEditor from './TextareaEditor';
import DebounceInput from 'dmn-js-shared/lib/features/debounce-input';

export default {
  __depends__: [ DebounceInput ],
  __init__: [ 'textarea' ],
  textarea: [ 'type', TextareaEditor ]
};