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
function IoLabel(eventBus, sheet, elementRegistry, graphicsFactory, rules) {

  this.row = null;

  var self = this;

  eventBus.on([ 'sheet.init', 'sheet.cleared' ], function(event) {

    eventBus.fire('ioLabel.add', event);

    this.row = sheet.addRow({
      id: 'ioLabel',
      isHead: true,
      isLabelRow: true,
      useTH: true
    });

    eventBus.fire('ioLabel.added', this.row);
  }, this);

  eventBus.on([ 'sheet.destroy', 'sheet.clear' ], function(event) {

    eventBus.fire('ioLabel.destroy', this.row);

    sheet.removeRow({
      id: 'ioLabel'
    });

    eventBus.fire('ioLabel.destroyed', this.row);

    this.row = null;
  }, this);

  function updateColspans(evt) {
    var cells = elementRegistry.filter(function(element) {
      return element._type === 'cell' && element.row === self.row;
    });

    var inputs = cells.filter(function(cell) {
      return cell.column.businessObject && cell.column.businessObject.inputExpression;
    });

    forEach(inputs, function(input) {
      if (!input.column.previous.businessObject) {
        // first cell of the inputs array has the colspan attribute set
        input.colspan = inputs.length;

        var node;
        if (rules.allowed('column.create')) {
          node = domify('Input <a class="dmn-icon-plus"></a>');
          node.querySelector('a').addEventListener('mouseup', function() {
            var col = input.column;
            while (col.next && col.next.businessObject.$type === 'dmn:InputClause') {
              col = col.next;
            }

            var newColumn = {
              id: ids.next(),
              previous: col,
              name: '',
              isInput: true
            };

            eventBus.fire('ioLabel.createColumn', {
              newColumn: newColumn
            });
          });
        } else {
          node = domify('Input');
        }

        input.content = node;
      } else {
        input.colspan = 1;
      }
    });

    var outputs = cells.filter(function(cell) {
      return cell.column.businessObject && cell.column.businessObject.$instanceOf('dmn:OutputClause');
    });

    forEach(outputs, function(output) {
      if (output.column.previous.businessObject.inputExpression) {
        // first cell of the outputs array has the colspan attribute set
        output.colspan = outputs.length;

        var node;
        if (rules.allowed('column.create')) {
          node = domify('Output <a class="dmn-icon-plus"></a>');
          node.querySelector('a').addEventListener('mouseup', function() {
            var col = output.column;
            while (col.next && col.next.businessObject && col.next.businessObject.$type === 'dmn:OutputClause') {
              col = col.next;
            }

            var newColumn = {
              id: ids.next(),
              previous: col,
              name: '',
              isInput: false
            };

            eventBus.fire('ioLabel.createColumn', {
              newColumn: newColumn
            });
          });
        } else {
          node = domify('Output');
        }

        output.content = node;
      } else {
        output.colspan = 1;
      }
    });

    if (cells.length > 0) {
      graphicsFactory.update('row', cells[0].row, elementRegistry.getGraphics(cells[0].row.id));
    }
  }
  eventBus.on([ 'cells.added', 'cells.removed' ], function(evt) {
    if (evt._type === 'column') {
      updateColspans();
    }
  });

  eventBus.on([ 'column.move.applied' ], updateColspans);
}

IoLabel.$inject = [ 'eventBus', 'sheet', 'elementRegistry', 'graphicsFactory', 'rules' ];

module.exports = IoLabel;

IoLabel.prototype.getRow = function() {
  return this.row;
};
