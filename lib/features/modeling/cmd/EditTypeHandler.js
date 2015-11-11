'use strict';

/**
 * A handler that implements reversible editing of the datatype for a clause.
 *
 */
function EditTypeHandler(elementRegistry, graphicsFactory, dmnFactory) {
  this._elementRegistry = elementRegistry;
  this._graphicsFactory = graphicsFactory;
  this._dmnFactory = dmnFactory;
}

EditTypeHandler.$inject = [ 'elementRegistry', 'graphicsFactory', 'dmnFactory' ];

module.exports = EditTypeHandler;



////// api /////////////////////////////////////////


/**
 * Edits the dataType
 *
 * @param {Object} context
 */
EditTypeHandler.prototype.execute = function(context) {

  var cellContent = context.cell.content;

  if(cellContent.inputExpression) {
    context.oldType = cellContent.inputExpression.typeRef;
    cellContent.inputExpression.typeRef = context.newType;
  } else {
    context.oldType = cellContent.typeRef;
    cellContent.typeRef = context.newType;
  }

  this._graphicsFactory.update('cell', context.cell, this._elementRegistry.getGraphics(context.cell.id));

  return context;
};


/**
 * Undo Edit by resetting the content
 */
EditTypeHandler.prototype.revert = function(context) {

  var cellContent = context.cell.content;

  if(cellContent.inputExpression) {
    cellContent.inputExpression.typeRef = context.oldType;
  } else {
    cellContent.typeRef = context.oldType;
  }

  this._graphicsFactory.update('cell', context.cell, this._elementRegistry.getGraphics(context.cell.id));

  return context;
};
