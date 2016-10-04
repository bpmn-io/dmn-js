'use strict';

/**
 * A handler that implements reversible editing of a description for a cell
 *
 */
function EditDescriptionHandler() {
}

module.exports = EditDescriptionHandler;



////// api /////////////////////////////////////////


/**
 * Edits the expression language
 *
 * @param {Object} context
 */
EditDescriptionHandler.prototype.execute = function(context) {

  context.oldDescription = context.businessObject.description;

  context.businessObject.description = context.newDescription;

  return context;
};


/**
 * Undo Edit by resetting the content
 */
EditDescriptionHandler.prototype.revert = function(context) {

  context.businessObject.description = context.oldDescription;

  return context;
};
