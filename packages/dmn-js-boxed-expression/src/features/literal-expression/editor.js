import {
  LiteralExpressionEditorComponentProvider
} from './components/LiteralExpressionEditorComponent';
import LiteralExpressionEditor from './LiteralExpressionEditor';

export default {
  __init__: [ 'literalExpressionComponent' ],
  literalExpressionComponent: [ 'type', LiteralExpressionEditorComponentProvider ],
  literalExpression: [ 'type', LiteralExpressionEditor ]
};
