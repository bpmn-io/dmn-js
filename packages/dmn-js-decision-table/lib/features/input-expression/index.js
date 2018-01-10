import ContextMenu from 'table-js/lib/features/context-menu';
import DebounceInput from '../debounce-input';
import InputExpression from './InputExpression';
import Modeling from '../modeling';

export default {
  __depends__: [ ContextMenu, DebounceInput, Modeling ],
  __init__: [ 'inputExpression' ],
  inputExpression: [ 'type', InputExpression ]
};