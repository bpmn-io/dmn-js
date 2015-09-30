'use strict';

/**
 * A handler that implements reversible editing of the hit policy.
 */
function EditIdHandler() {
}

EditIdHandler.$inject = [ ];

module.exports = EditIdHandler;



////// api /////////////////////////////////////////


/**
 * Edits the hit policy
 *
 * @param {Object} context
 */
EditIdHandler.prototype.execute = function(context) {
  console.log('changing');
  context.oldPolicy = context.table.hitPolicy;
  context.table.hitPolicy = context.newPolicy;
  return context;
};


/**
 * Undo Edit by resetting the content
 */
EditIdHandler.prototype.revert = function(context) {
  context.table.hitPolicy = context.oldPolicy;
  return context;
};
