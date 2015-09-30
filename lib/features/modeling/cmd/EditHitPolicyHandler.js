'use strict';

/**
 * A handler that implements reversible editing of the hit policy.
 */
function EditHitPolicyHandler() {
}

EditHitPolicyHandler.$inject = [ ];

module.exports = EditHitPolicyHandler;



////// api /////////////////////////////////////////


/**
 * Edits the hit policy
 *
 * @param {Object} context
 */
EditHitPolicyHandler.prototype.execute = function(context) {
  context.oldPolicy = context.table.hitPolicy;
  context.table.hitPolicy = context.newPolicy;
  return context;
};


/**
 * Undo Edit by resetting the content
 */
EditHitPolicyHandler.prototype.revert = function(context) {
  context.table.hitPolicy = context.oldPolicy;
  return context;
};
