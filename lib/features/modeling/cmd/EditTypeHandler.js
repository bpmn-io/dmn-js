'use strict';

/**
 * A handler that implements reversible editing of the datatype for a clause.
 *
 */
function EditTypeHandler(elementRegistry, graphicsFactory) {
  this._elementRegistry = elementRegistry;
  this._graphicsFactory = graphicsFactory;
}

EditTypeHandler.$inject = [ 'elementRegistry', 'graphicsFactory' ];

module.exports = EditTypeHandler;



////// api /////////////////////////////////////////


/**
 * Edits the dataType
 *
 * @param {Object} context
 */
EditTypeHandler.prototype.execute = function(context) {
  context.oldType = context.cell.content.typeDefinition;
  context.cell.content.typeDefinition = context.newType;

  this._graphicsFactory.update('cell', context.cell, this._elementRegistry.getGraphics(context.cell.id));

  return context;
};


/**
 * Undo Edit by resetting the content
 */
EditTypeHandler.prototype.revert = function(context) {
  context.cell.content.typeDefinition = context.oldType;

  this._graphicsFactory.update('cell', context.cell, this._elementRegistry.getGraphics(context.cell.id));

  return context;
};
