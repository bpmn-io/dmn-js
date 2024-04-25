import LiteralExpression from './LiteralExpression';

export default class LiteralExpressionEditor extends LiteralExpression {
  constructor(modeling) {
    super();
    this._modeling = modeling;
  }

  setText(literalExpression, value) {
    this._modeling.updateProperties(literalExpression, { text: value });
  }
}

LiteralExpressionEditor.$inject = [ 'modeling' ];
