'use strict';

/**
 * A handler that implements reversible editing of the hit policy.
 */
function EditHitPolicyHandler(elementRegistry, graphicsFactory) {
  this._elementRegistry = elementRegistry;
  this._graphicsFactory = graphicsFactory;
}

EditHitPolicyHandler.$inject = [ 'elementRegistry', 'graphicsFactory' ];

module.exports = EditHitPolicyHandler;



////// api /////////////////////////////////////////


/**
 * Edits the hit policy
 *
 * @param {Object} context
 */
EditHitPolicyHandler.prototype.execute = function(context) {
  context.oldPolicy = context.table.hitPolicy;
  context.oldAggregation = context.table.aggregation;

  context.table.hitPolicy = context.newPolicy;

  if (context.newAggregation) {
    context.table.aggregation = context.newAggregation;
  } else {
    context.table.aggregation = undefined;
  }

  this._graphicsFactory.update('cell', context.cell, this._elementRegistry.getGraphics(context.cell.id));

  return context;
};


/**
 * Undo Edit by resetting the content
 */
EditHitPolicyHandler.prototype.revert = function(context) {
  context.table.hitPolicy = context.oldPolicy;
  if (context.oldAggregation) {
    context.table.aggregation = context.oldAggregation;
  } else {
    context.table.aggregation = undefined;
  }

  this._graphicsFactory.update('cell', context.cell, this._elementRegistry.getGraphics(context.cell.id));

  return context;
};
