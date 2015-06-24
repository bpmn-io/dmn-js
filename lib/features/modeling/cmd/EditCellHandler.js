'use strict';

/**
 * A handler that implements reversible addition of rows.
 *
 * @param {sheet} sheet
 */
function EditCellHandler(sheet, elementRegistry, graphicsFactory, moddle, dmnFactory) {
  this._sheet = sheet;
  this._elementRegistry = elementRegistry;
  this._graphicsFactory = graphicsFactory;
  this._dmnFactory = dmnFactory;
  this._moddle = moddle;
}

EditCellHandler.$inject = [ 'sheet', 'elementRegistry', 'graphicsFactory', 'moddle', 'dmnFactory' ];

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
  if(el.row.isHead) {
    // update the clause names
    context.oldContent = el.column.businessObject.name;
    el.column.businessObject.name = context.content;
  } else {
    // update a rule cell
    if(el.content) {
      context.oldContent = el.content.text;
      el.content.text = context.content;
    } else {
      // need to create a semantic object
      el.content = this._dmnFactory[el.column.businessObject.inputEntry ? 'createInputEntry' : 'createOutputEntry']
            (context.content, el.column.businessObject, el.row.businessObject);
    }

    // remove empty cells
    if(context.content === '') {
      if(el.column.businessObject.inputEntry) {
        el.column.businessObject.inputEntry.splice(el.column.businessObject.inputEntry.indexOf(el.content), 1);
      } else {
        el.column.businessObject.outputEntry.splice(el.column.businessObject.outputEntry.indexOf(el.content), 1);
      }
      el.row.businessObject[el.column.businessObject.inputEntry ? 'condition' : 'conclusion'].splice(
        el.row.businessObject[el.column.businessObject.inputEntry ? 'condition' : 'conclusion'].indexOf(el.content), 1);
      delete el.content;
    }
  }

  this._graphicsFactory.update('cell', el, gfx);

  return context;
};


/**
 * Undo Edit by resetting the content
 */
EditCellHandler.prototype.revert = function(context) {
  var el = this._elementRegistry.get('cell_' + context.column + '_' + context.row);
  var gfx= this._elementRegistry.getGraphics('cell_' + context.column + '_' + context.row);

  if(el.row.isHead) {
    // revert clause name
    el.column.businessObject.name = context.oldContent;
  } else {
    // revert a rule cell
    el.content.text = context.oldContent;
  }

  this._graphicsFactory.update('cell', el, gfx);

  return context;
};
