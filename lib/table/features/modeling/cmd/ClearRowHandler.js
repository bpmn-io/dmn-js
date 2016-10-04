'use strict';

var forEach = require('lodash/collection/forEach');

/**
 * A handler that implements reversible clear of rows
 *
 * @param {sheet} sheet
 */
function ClearRowHandler(elementRegistry, utilityColumn, graphicsFactory) {
  this._elementRegistry = elementRegistry;
  this._utilityColumn = utilityColumn;
  this._graphicsFactory = graphicsFactory;
}

ClearRowHandler.$inject = [ 'elementRegistry', 'utilityColumn', 'graphicsFactory' ];

module.exports = ClearRowHandler;



////// api /////////////////////////////////////////


/**
 * Clear a row
 *
 * @param {Object} context
 */
ClearRowHandler.prototype.execute = function(context) {
  var self = this;
  var utilityColumn = this._utilityColumn && this._utilityColumn.getColumn();
  var cells = this._elementRegistry.filter(function(element) {
    if (utilityColumn) {
      return element._type === 'cell' && element.row === context.row && element.column !== utilityColumn;
    } else {
      return element._type === 'cell' && element.row === context.row;
    }
  });
  context._oldContent = [];
  forEach(cells, function(cell) {
    if (cell.content) {
      context._oldContent.push(cell.content.text);
      cell.content.text = '';
    }
    self._graphicsFactory.update('cell', cell, self._elementRegistry.getGraphics(cell.id));
  });
};


/**
 * Undo clear by resetting the content
 */
ClearRowHandler.prototype.revert = function(context) {
  var self = this;
  var utilityColumn = this._utilityColumn && this._utilityColumn.getColumn();
  var cells = this._elementRegistry.filter(function(element) {
    if (utilityColumn) {
      return element._type === 'cell' && element.row === context.row && element.column !== utilityColumn;
    } else {
      return element._type === 'cell' && element.row === context.row;
    }
  });
  var i = 0;
  forEach(cells, function(cell) {
    if (cell.content) {
      cell.content.text = context._oldContent[i++];
    }
    self._graphicsFactory.update('cell', cell, self._elementRegistry.getGraphics(cell.id));
  });
};
