import LiteralExpressionPropertiesEditor from './LiteralExpressionPropertiesEditor';
import Modeling from '../modeling';
import DebounceInput from 'dmn-js-decision-table/lib/features/debounce-input';

export default {
  __depends__: [ DebounceInput, Modeling ],
  __init__: [ 'literalExpressionProperties' ],
  literalExpressionProperties: [ 'type', LiteralExpressionPropertiesEditor ]
};