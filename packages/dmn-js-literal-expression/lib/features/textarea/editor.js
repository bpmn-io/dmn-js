import TextareaEditor from './TextareaEditor';
import Modeling from '../modeling';
import DebounceInput from 'dmn-js-decision-table/lib/features/debounce-input';

export default {
  __depends__: [ DebounceInput, Modeling ],
  __init__: [ 'textarea' ],
  textarea: [ 'type', TextareaEditor ]
};