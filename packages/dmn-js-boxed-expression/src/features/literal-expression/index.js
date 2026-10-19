import ExpressionLanguagesModule from 'dmn-js-shared/lib/features/expression-languages';

import {
  LiteralExpressionComponentProvider
} from './components/LiteralExpressionComponent';
import {
  ExpressionLanguageComponentProvider
} from './components/ExpressionLanguageComponent';
import LiteralExpression from './LiteralExpression';

export default {
  __depends__: [ ExpressionLanguagesModule ],
  __init__: [ 'expressionLanguageComponent', 'literalExpressionComponent' ],
  expressionLanguageComponent: [ 'type', ExpressionLanguageComponentProvider ],
  literalExpressionComponent: [ 'type', LiteralExpressionComponentProvider ],
  literalExpression: [ 'type', LiteralExpression ]
};
