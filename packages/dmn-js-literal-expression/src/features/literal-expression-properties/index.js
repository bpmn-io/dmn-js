import ExpressionLanguagesModule from 'dmn-js-shared/lib/features/expression-languages';

import LiteralExpressionProperties from './LiteralExpressionProperties';

export default {
  __depends__: [
    ExpressionLanguagesModule
  ],
  __init__: [ 'literalExpressionProperties' ],
  literalExpressionProperties: [ 'type', LiteralExpressionProperties ]
};