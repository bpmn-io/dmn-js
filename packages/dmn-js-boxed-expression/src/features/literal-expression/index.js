import {
  LiteralExpressionComponentProvider
} from './components/LiteralExpressionComponent';
import LiteralExpression from './LiteralExpression';

export default {
  __init__: [ 'literalExpressionComponent' ],
  literalExpressionComponent: [ 'type', LiteralExpressionComponentProvider ],
  literalExpression: [ 'type', LiteralExpression ]
};
