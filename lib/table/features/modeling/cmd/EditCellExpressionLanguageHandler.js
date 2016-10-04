'use strict';

/**
 * A handler that implements reversible editing of the expression language for a cell.
 *
 */
function EditCellExpressionLanguageHandler() {
}

module.exports = EditCellExpressionLanguageHandler;



////// api /////////////////////////////////////////


/**
 * Edits the expression language
 *
 * @param {Object} context
 */
EditCellExpressionLanguageHandler.prototype.execute = function(context) {

  context.oldExpressionLanguage = context.businessObject.expressionLanguage;

  context.businessObject.expressionLanguage = context.newExpressionLanguage;

  return context;
};


/**
 * Undo Edit by resetting the content
 */
EditCellExpressionLanguageHandler.prototype.revert = function(context) {

  context.businessObject.expressionLanguage = context.oldExpressionLanguage;

  return context;
};
