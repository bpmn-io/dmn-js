'use strict';

var forEach = require('lodash/collection/forEach');

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
  context.oldType = context.cell.content.typeDefinition;
  context.cell.content.typeDefinition = context.newType;

  if(context.cell.content.allowedValue) {
    context.oldAllowedValue = context.cell.content.allowedValue;
  }
  // clear allowed values before maybe repopulating them:
  context.cell.content.allowedValue = undefined;

  if(typeof context.allowedValues !== 'undefined') {
    var self = this;
    forEach(context.allowedValues, function(allowedValue) {
      self._dmnFactory.createAllowedValue(allowedValue, context.cell.content);
    });
  }

  this._graphicsFactory.update('cell', context.cell, this._elementRegistry.getGraphics(context.cell.id));

  return context;
};


/**
 * Undo Edit by resetting the content
 */
EditTypeHandler.prototype.revert = function(context) {
  context.cell.content.typeDefinition = context.oldType;

  if(context.oldAllowedValue) {
    context.cell.content.allowedValue = context.oldAllowedValue;
  } else {
    context.cell.content.allowedValue = undefined;
  }

  this._graphicsFactory.update('cell', context.cell, this._elementRegistry.getGraphics(context.cell.id));

  return context;
};
