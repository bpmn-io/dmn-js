import LiteralExpression from './LiteralExpression';

export default class LiteralExpressionEditor extends LiteralExpression {
  constructor(modeling) {
    super();
    this._modeling = modeling;
  }

  setText(literalExpression, value) {
    this._modeling.updateProperties(literalExpression, { text: value });
  }

  setExpressionLanguage(literalExpression, expressionLanguage) {
    this._modeling.updateProperties(literalExpression, {

      // an empty value removes the expression language
      expressionLanguage: expressionLanguage || undefined
    });
  }
}

LiteralExpressionEditor.$inject = [ 'modeling' ];
