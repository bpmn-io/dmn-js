'use strict';

/**
 * A handler that implements reversible addition of rows.
 *
 * @param {sheet} sheet
 */
function EditInputMappingHandler(elementRegistry, graphicsFactory) {
  this._elementRegistry = elementRegistry;
  this._graphicsFactory = graphicsFactory;
}

EditInputMappingHandler.$inject = ['elementRegistry', 'graphicsFactory' ];

module.exports = EditInputMappingHandler;



////// api /////////////////////////////////////////


/**
 * Edits the content of the cell
 *
 * @param {Object} context
 */
EditInputMappingHandler.prototype.execute = function(context) {
  var cell = context.cell,
      content = cell.content;

  context.oldMapping = content.text;
  context.oldInputVariable = content.inputVariable;
  content.text = context.newMapping;

  if (content.expressionLanguage) {
    context.oldLanguage = content.expressionLanguage;
  }

  if (context.inputVariable) {
    content.$parent.inputVariable = context.inputVariable;
  }

  if (typeof context.language !== 'undefined') {
    content.expressionLanguage = context.language;
  } else {
    content.expressionLanguage = undefined;
  }

  this._graphicsFactory.update('cell', cell, this._elementRegistry.getGraphics(cell.id));

  return context;
};


/**
 * Undo Edit by resetting the content
 */
EditInputMappingHandler.prototype.revert = function(context) {
  var cell = context.cell,
      content = cell.content;

  content.text = context.oldMapping;
  context.inputVariable = content.oldInputVariable;

  if (context.inputVariable) {
    content.$parent.inputVariable = context.inputVariable;
  }

  if (context.oldLanguage) {
    content.expressionLanguage = context.oldLanguage;
  } else {
    content.expressionLanguage = undefined;
  }

  this._graphicsFactory.update('cell', cell, this._elementRegistry.getGraphics(cell.id));

  return context;
};
