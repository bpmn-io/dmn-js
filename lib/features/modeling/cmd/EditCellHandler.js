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
    if(el.row.isMappingsRow) {
      // update the output name of the clause
      // (input expressions are handled by the popover, not the cell edit)
      context.oldContent = el.content.name;
      el.content.name = context.content;
    } else if(el.row.isClauseRow) {
      // update the clause names
      context.oldContent = el.column.businessObject.label;
      el.column.businessObject.label = context.content;
    }
  } else {

    if(el.column.isAnnotationsColumn) {
      // update the annotations of a rule
      context.oldContent = el.row.businessObject.description;
      el.row.businessObject.description = context.content;
    } else {
      // update a rule cell
      if(el.content) {
        context.oldContent = el.content.text;
        el.content.text = context.content;
      } else {
        // need to create a semantic object
        var inputOrOutput = el.column.businessObject.inputExpression ? 'createInputEntry' : 'createOutputEntry';
        el.content = this._dmnFactory[inputOrOutput](context.content, el.column.businessObject, el.row.businessObject);
      }
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
    if(el.row.isMappingsRow) {
      // revert the output name of the clause
      el.content.name = context.oldContent;
    } else if(el.row.isClauseRow) {
      // revert clause name
      el.column.businessObject.label = context.oldContent;
    }

  } else {

    if(el.column.isAnnotationsColumn) {
      // revert the annotations of a rule
      el.row.businessObject.description = context.oldContent;
    } else {
      // revert a rule cell
      if(!el.content) {
        var inputOrOutput = el.column.businessObject.inputExpression ? 'createInputEntry' : 'createOutputEntry',
            oldContent = context.oldContent;
        // could have been deleted
        el.content = this._dmnFactory[inputOrOutput](oldContent, el.column.businessObject, el.row.businessObject);
      } else {
        el.content.text = context.oldContent;
      }
    }

  }

  this._graphicsFactory.update('cell', el, gfx);

  return context;
};
