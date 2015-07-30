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

  context.oldMapping = context.cell.content.text;
  context.cell.content.text = context.newMapping;

  if(context.cell.content.expressionLanguage) {
    context.oldLanguage = context.cell.content.expressionLanguage;
  }

  if(typeof context.language !== 'undefined') {
    context.cell.content.expressionLanguage = context.language;
  } else {
    context.cell.content.expressionLanguage = undefined;
  }

  this._graphicsFactory.update('cell', context.cell, this._elementRegistry.getGraphics(context.cell.id));

  return context;
};


/**
 * Undo Edit by resetting the content
 */
EditInputMappingHandler.prototype.revert = function(context) {

  context.cell.content.text = context.oldMapping;

  if(context.oldLanguage) {
    context.cell.content.expressionLanguage = context.oldLanguage;
  } else {
    context.cell.content.expressionLanguage = undefined;
  }

  this._graphicsFactory.update('cell', context.cell, this._elementRegistry.getGraphics(context.cell.id));

  return context;
};
