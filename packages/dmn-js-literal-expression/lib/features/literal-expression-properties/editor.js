import LiteralExpressionPropertiesEditor from './LiteralExpressionPropertiesEditor';
import DebounceInput from 'dmn-js-shared/lib/features/debounce-input';
import Keyboard from '../keyboard';

export default {
  __depends__: [ DebounceInput, Keyboard ],
  __init__: [ 'literalExpressionProperties' ],
  literalExpressionProperties: [ 'type', LiteralExpressionPropertiesEditor ]
};