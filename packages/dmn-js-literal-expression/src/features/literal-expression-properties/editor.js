import LiteralExpressionPropertiesEditor from './LiteralExpressionPropertiesEditor';
import DebounceInput from 'dmn-js-shared/lib/features/debounce-input';
import Keyboard from '../keyboard';
import DataTypesModule from 'dmn-js-shared/lib/features/data-types/DataTypes';
import ExpressionLanguagesModule from 'dmn-js-shared/lib/features/expression-languages';

export default {
  __depends__: [
    DebounceInput,
    Keyboard,
    ExpressionLanguagesModule,
    DataTypesModule
  ],
  __init__: [ 'literalExpressionProperties' ],
  literalExpressionProperties: [ 'type', LiteralExpressionPropertiesEditor ]
};