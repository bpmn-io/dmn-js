import LiteralExpressionPropertiesEditor from './LiteralExpressionPropertiesEditor';
import DebounceInput from 'dmn-js-decision-table/lib/features/debounce-input';

export default {
  __depends__: [ DebounceInput ],
  __init__: [ 'literalExpressionProperties' ],
  literalExpressionProperties: [ 'type', LiteralExpressionPropertiesEditor ]
};