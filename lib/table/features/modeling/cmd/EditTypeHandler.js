'use strict';

/**
 * A handler that implements reversible editing of the datatype for a clause.
 *
 */
function EditTypeHandler(elementRegistry, graphicsFactory, tableFactory) {
  this._elementRegistry = elementRegistry;
  this._graphicsFactory = graphicsFactory;
  this._tableFactory = tableFactory;
}

EditTypeHandler.$inject = [ 'elementRegistry', 'graphicsFactory', 'tableFactory' ];

module.exports = EditTypeHandler;



////// api /////////////////////////////////////////


/**
 * Edits the dataType
 *
 * @param {Object} context
 */
EditTypeHandler.prototype.execute = function(context) {

  var cellContent = context.cell.content;

  if (cellContent.inputExpression) {
    context.oldType = cellContent.inputExpression.typeRef;
    cellContent.inputExpression.typeRef = context.newType;

    if (cellContent.inputValues && context.newType !== context.oldType) {
      context.oldInputValues = cellContent.inputValues;
      delete cellContent.inputValues;
    }
  } else {
    context.oldType = cellContent.typeRef;
    cellContent.typeRef = context.newType;

    if (cellContent.outputValues && context.newType !== context.oldType) {
      context.oldOutputValues = cellContent.outputValues;
      delete cellContent.outputValues;
    }
  }

  this._graphicsFactory.update('cell', context.cell, this._elementRegistry.getGraphics(context.cell.id));

  return context;
};


/**
 * Undo Edit by resetting the content
 */
EditTypeHandler.prototype.revert = function(context) {

  var cellContent = context.cell.content;

  if (cellContent.inputExpression) {
    cellContent.inputExpression.typeRef = context.oldType;

    if (context.oldInputValues) {
      cellContent.inputValues = context.oldInputValues;
    }
  } else {
    cellContent.typeRef = context.oldType;

    if (context.oldOutputValues) {
      cellContent.outputValues = context.oldOutputValues;
    }
  }

  this._graphicsFactory.update('cell', context.cell, this._elementRegistry.getGraphics(context.cell.id));

  return context;
};
