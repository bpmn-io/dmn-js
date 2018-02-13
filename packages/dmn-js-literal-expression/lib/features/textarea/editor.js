import TextareaEditor from './TextareaEditor';
import DebounceInput from 'dmn-js-decision-table/lib/features/debounce-input';

export default {
  __depends__: [ DebounceInput ],
  __init__: [ 'textarea' ],
  textarea: [ 'type', TextareaEditor ]
};