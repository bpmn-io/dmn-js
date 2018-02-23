import ContextMenu from 'table-js/lib/features/context-menu';
import DebounceInput from 'dmn-js-shared/lib/features/debounce-input';
import InputExpression from './InputExpression';

export default {
  __depends__: [ ContextMenu, DebounceInput ],
  __init__: [ 'inputExpression' ],
  inputExpression: [ 'type', InputExpression ]
};