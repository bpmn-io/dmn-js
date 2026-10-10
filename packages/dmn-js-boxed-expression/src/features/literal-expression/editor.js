import ExpressionLanguagesModule from 'dmn-js-shared/lib/features/expression-languages';

import {
  LiteralExpressionEditorComponentProvider
} from './components/LiteralExpressionEditorComponent';
import {
  ExpressionLanguageEditorComponentProvider
} from './components/ExpressionLanguageEditorComponent';
import LiteralExpressionEditor from './LiteralExpressionEditor';

export default {
  __depends__: [ ExpressionLanguagesModule ],
  __init__: [ 'expressionLanguageComponent', 'literalExpressionComponent' ],
  expressionLanguageComponent: [
    'type',
    ExpressionLanguageEditorComponentProvider
  ],
  literalExpressionComponent: [ 'type', LiteralExpressionEditorComponentProvider ],
  literalExpression: [ 'type', LiteralExpressionEditor ]
};
