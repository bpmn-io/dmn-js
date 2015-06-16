'use strict';

/**
 * A handler that implements reversible addition of rows.
 *
 * @param {sheet} sheet
 */
function EditCellHandler(sheet, elementRegistry, graphicsFactory) {
  this._sheet = sheet;
  this._elementRegistry = elementRegistry;
  this._graphicsFactory = graphicsFactory;
}

EditCellHandler.$inject = [ 'sheet', 'elementRegistry', 'graphicsFactory' ];

module.exports = EditCellHandler;



////// api /////////////////////////////////////////


/**
 * Edits the content of the cell
 *
 * @param {Object} context
 */
EditCellHandler.prototype.execute = function(context) {
  // get the business object
  var el = this._elementRegistry.get('cell_' + context.column + '_' + context.row);
  var gfx= this._elementRegistry.getGraphics('cell_' + context.column + '_' + context.row);

  context.oldContent = el.content.text;
  el.content.text = context.content;

  this._graphicsFactory.update('cell', el, gfx);

  return context;
};


/**
 * Undo Edit by resetting the content
 */
EditCellHandler.prototype.revert = function(context) {
  var el = this._elementRegistry.get('cell_' + context.column + '_' + context.row);
  var gfx= this._elementRegistry.getGraphics('cell_' + context.column + '_' + context.row);

  el.content.text = context.oldContent;

  this._graphicsFactory.update('cell', el, gfx);

  return context;
};
