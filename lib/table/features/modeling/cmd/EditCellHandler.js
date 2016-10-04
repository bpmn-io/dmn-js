'use strict';

var calculateSelectionUpdate = require('selection-update');

function getSelection(node) {

  var selectObj = document.getSelection();
  if (selectObj.rangeCount > 0) {
    var range = selectObj.getRangeAt(0);

    return {
      start: range.startOffset,
      end: range.endOffset,
      obj: selectObj
    };
  }
  return {
    start: 0,
    end: 0,
    obj: selectObj
  };
}

function updateSelection(newSelection, gfx) {
  var range = document.createRange();
  var sel = document.getSelection();
  if (gfx.childNodes[0].firstChild) {
    range.setStart(gfx.childNodes[0].firstChild, newSelection.start);
    range.setEnd(gfx.childNodes[0].firstChild, newSelection.end);
  } else {
    range.setStart(gfx.childNodes[0], 0);
    range.setEnd(gfx.childNodes[0], 0);
  }

  sel.removeAllRanges();
  sel.addRange(range);
}

/**
 * A handler that implements reversible addition of rows.
 *
 * @param {sheet} sheet
 */
function EditCellHandler(sheet, elementRegistry, graphicsFactory, moddle, tableFactory) {
  this._sheet = sheet;
  this._elementRegistry = elementRegistry;
  this._graphicsFactory = graphicsFactory;
  this._tableFactory = tableFactory;
  this._moddle = moddle;
}

EditCellHandler.$inject = [ 'sheet', 'elementRegistry', 'graphicsFactory', 'moddle', 'tableFactory' ];

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
  if (el.row.isHead) {
    if (el.row.isMappingsRow) {
      // update the output name of the clause
      // (input expressions are handled by the popover, not the cell edit)
      context.oldContent = el.content.name;
      if (context.oldContent === context.content) {
        return context;
      }
      el.content.name = context.content;
    } else if (el.row.isClauseRow) {
      // update the clause names
      context.oldContent = el.column.businessObject.label;
      if (context.oldContent === context.content) {
        return context;
      }
      el.column.businessObject.label = context.content;
    }
  } else {

    if (el.column.isAnnotationsColumn) {
      // update the annotations of a rule
      context.oldContent = el.row.businessObject.description;
      if (context.oldContent === context.content) {
        return context;
      }
      el.row.businessObject.description = context.content;
    } else {
      // update a rule cell
      if (el.content) {
        context.oldContent = el.content.text;
        if (context.oldContent === context.content) {
          return context;
        }
        el.content.text = context.content;
      } else {
        // need to create a semantic object
        var inputOrOutput = el.column.businessObject.inputExpression ? 'createInputEntry' : 'createOutputEntry';
        el.content = this._tableFactory[inputOrOutput](context.content, el.column.businessObject, el.row.businessObject);
      }
    }
  }

  var selection = getSelection();
  var newSelection = calculateSelectionUpdate(selection, gfx.textContent, context.content);
  this._graphicsFactory.update('cell', el, gfx);

  // we only want to apply the selection, when it is explicitely enforced
  // otherwise the cursor may jump around while editing the cell
  if (context.applySelection) {
    updateSelection(newSelection, gfx);
  } else if (gfx.contains(selection.obj.anchorNode)) {
    // if the selection is not updated, restore the old selection
    updateSelection(selection, gfx);
  }

  // explicitely force selection application for subsequent calls (e.g. using re-/undo)
  context.applySelection = true;


  return context;
};


/**
 * Undo Edit by resetting the content
 */
EditCellHandler.prototype.revert = function(context) {
  var el = this._elementRegistry.get('cell_' + context.column + '_' + context.row);
  var gfx= this._elementRegistry.getGraphics('cell_' + context.column + '_' + context.row);

  if (el.row.isHead) {
    if (el.row.isMappingsRow) {
      // revert the output name of the clause
      el.content.name = context.oldContent;
    } else if (el.row.isClauseRow) {
      // revert clause name
      el.column.businessObject.label = context.oldContent;
    }
  } else {
    if (el.column.isAnnotationsColumn) {
      // revert the annotations of a rule
      el.row.businessObject.description = context.oldContent;
    } else {
      // revert a rule cell
      if (!el.content) {
        var inputOrOutput = el.column.businessObject.inputExpression ? 'createInputEntry' : 'createOutputEntry',
            oldContent = context.oldContent;
        // could have been deleted
        el.content = this._tableFactory[inputOrOutput](oldContent, el.column.businessObject, el.row.businessObject);
      } else {
        el.content.text = context.oldContent;
      }
    }
  }

  var selection = getSelection();
  var newSelection = calculateSelectionUpdate(selection, gfx.textContent, context.oldContent);
  this._graphicsFactory.update('cell', el, gfx);
  updateSelection(newSelection, gfx);

  return context;
};
