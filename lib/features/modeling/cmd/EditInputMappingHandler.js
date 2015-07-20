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

  this._graphicsFactory.update('cell', context.cell, this._elementRegistry.getGraphics(context.cell.id));

  return context;
};


/**
 * Undo Edit by resetting the content
 */
EditInputMappingHandler.prototype.revert = function(context) {
  context.cell.content.text = context.oldMapping;

  this._graphicsFactory.update('cell', context.cell, this._elementRegistry.getGraphics(context.cell.id));

  return context;
};
