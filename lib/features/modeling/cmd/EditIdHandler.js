'use strict';

/**
 * A handler that implements reversible editing of the table id.
 *
 * @param {tableName} tableName
 */
function EditIdHandler(tableName) {
  this._tableName = tableName;
}

EditIdHandler.$inject = [ 'tableName' ];

module.exports = EditIdHandler;



////// api /////////////////////////////////////////


/**
 * Edits the table id
 *
 * @param {Object} context
 */
EditIdHandler.prototype.execute = function(context) {
  context.oldId = this._tableName.getId();
  this._tableName.setId(context.newId);
  return context;
};


/**
 * Undo Edit by resetting the content
 */
EditIdHandler.prototype.revert = function(context) {
  this._tableName.setId(context.oldId);
  return context;
};
