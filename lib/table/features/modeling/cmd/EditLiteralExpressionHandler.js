'use strict';

/**
 * A handler that implements reversible editing of Literal Expressions.
 */
function EditLiteralExpressionHandler(elementRegistry, graphicsFactory) {
  this._elementRegistry = elementRegistry;
  this._graphicsFactory = graphicsFactory;
}

EditLiteralExpressionHandler.$inject = [ 'elementRegistry', 'graphicsFactory' ];

module.exports = EditLiteralExpressionHandler;


////// api /////////////////////////////////////////

/**
 * Edits the literal Expression
 *
 * @param {Object} context
 */
EditLiteralExpressionHandler.prototype.execute = function(context) {

  var decision = context.decision;

  context.oldContent = {
    text: decision.literalExpression.text,
    name: decision.variable && decision.variable.name,
    type: decision.variable && decision.variable.typeRef,
    language: decision.literalExpression.expressionLanguage
  };

  decision.literalExpression.text = context.text;
  decision.variable.name = context.name;
  decision.variable.typeRef = context.type;
  decision.literalExpression.expressionLanguage = context.language;

  return context;
};


/**
 * Undo Edit by resetting the content
 */
EditLiteralExpressionHandler.prototype.revert = function(context) {

  var decision = context.decision;
  var oldContent = context.oldContent;

  decision.literalExpression.text = oldContent.text;
  decision.variable.name = oldContent.name;
  decision.variable.typeRef = oldContent.type;
  decision.literalExpression.expressionLanguage = oldContent.language;

  return context;
};
