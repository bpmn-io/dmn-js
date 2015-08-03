'use strict';

var domify = require('min-dom/lib/domify'),
    forEach = require('lodash/collection/forEach');

// document wide unique overlay ids
var ids = new (require('diagram-js/lib/util/IdGenerator'))('clause');

/**
 * Adds a control to the table to add more columns
 *
 * @param {EventBus} eventBus
 */
function IoLabel(eventBus, sheet, elementRegistry, modeling, graphicsFactory) {

  this.row = null;

  var self = this;
  eventBus.on('sheet.init', function(event) {

    eventBus.fire('ioLabel.add', event);

    self.row = sheet.addRow({
      id: 'ioLabel',
      isHead: true,
      isLabelRow: true,
      useTH: true
    });

    eventBus.fire('ioLabel.added', self.row);
  });

  eventBus.on('sheet.destroy', function(event) {

    eventBus.fire('ioLabel.destroy', self.row);

    sheet.removeRow({
      id: 'ioLabel'
    });

    eventBus.fire('ioLabel.destroyed', self.row);
  });

  function updateColspans(evt) {
    if(evt._type === 'column') {
      var cells = elementRegistry.filter(function(element) {
        return element._type === 'cell' && element.row === self.row;
      });

      var inputs = cells.filter(function(cell) {
        return cell.column.businessObject && cell.column.businessObject.inputExpression;
      });

      forEach(inputs, function(input) {
        if(!input.column.previous.businessObject) {
          // first cell of the inputs array has the colspan attribute set
          input.colspan = inputs.length;

          var node = domify('Input <a class="icon-dmn icon-plus"></a>');
          node.querySelector('a').addEventListener('mouseup', function() {
            var type = input.column.businessObject.inputEntry ? 'inputEntry' : 'outputEntry';
            var col = input.column;
            while(col.next && col.next.businessObject[type]) {
              col = col.next;
            }

            var newColumn = {
              id: ids.next(),
              previous: col,
              name: '',
              isInput: type === 'inputEntry'
            };

            modeling.createColumn(newColumn);
          });

          input.content = node;
        }
      });

      var outputs = cells.filter(function(cell) {
        return cell.column.businessObject && cell.column.businessObject.outputDefinition;
      });

      forEach(outputs, function(output) {
        if(output.column.previous.businessObject.inputExpression) {
          // first cell of the outputs array has the colspan attribute set
          output.colspan = outputs.length;

          var node = domify('Output <a class="icon-dmn icon-plus"></a>');
          node.querySelector('a').addEventListener('mouseup', function() {
            var type = output.column.businessObject.inputEntry ? 'inputEntry' : 'outputEntry';
            var col = output.column;
            while(col.next && col.next.businessObject && col.next.businessObject[type]) {
              col = col.next;
            }

            var newColumn = {
              id: ids.next(),
              previous: col,
              name: '',
              isInput: type === 'inputEntry'
            };

            modeling.createColumn(newColumn);
          });

          output.content = node;
        }
      });

      if(cells.length > 0) {
        graphicsFactory.update('row', cells[0].row, elementRegistry.getGraphics(cells[0].row.id));
      }
    }
  }
  eventBus.on(['cells.added', 'cells.removed'], updateColspans);

  var utilityColumn = null;
  var setRowSpanOfFirstCell = function() {
    if(utilityColumn && self.row) {
      var cell = elementRegistry.filter(function(element) {
        return element._type === 'cell' && element.row === self.row && element.column === utilityColumn;
      })[0];
      cell.rowspan = 4;
    }
  };
  eventBus.on('utilityColumn.added', function(event) {
    utilityColumn = event.column;
  });
  eventBus.on(['utilityColumn.added', 'ioLabel.added'], function(event) {
    setRowSpanOfFirstCell();
  });
}

IoLabel.$inject = [ 'eventBus', 'sheet', 'elementRegistry', 'modeling', 'graphicsFactory' ];

module.exports = IoLabel;

IoLabel.prototype.getRow = function() {
  return this.row;
};
