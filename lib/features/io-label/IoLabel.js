'use strict';

var domify = require('min-dom/lib/domify');

// document wide unique overlay ids
var ids = new (require('diagram-js/lib/util/IdGenerator'))('row');

/**
 * Adds a control to the table to add more rows
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

    eventBus.fire('ioLabel.added', self.column);
  });

  eventBus.on('sheet.destroy', function(event) {

    eventBus.fire('ioLabel.destroy', self.column);

    sheet.removeColumn({
      id: 'ioLabel'
    });

    eventBus.fire('ioLabel.destroyed', self.column);
  });

  function updateColspans(evt) {
    if(evt._type === 'column') {
      var cells = elementRegistry.filter(function(element) {
        return element._type === 'cell' && element.row === self.row;
      });

      var inputs = cells.filter(function(cell) {
        return cell.column.businessObject && cell.column.businessObject.inputExpression;
      });


      for(var i = 0; i < inputs.length; i++) {
        if(!inputs[i].column.previous.businessObject) {
          // first cell of the inputs array has the colspan attribute set
          inputs[i].colspan = inputs.length;
          inputs[i].content = 'Input';
        }
      }

      var outputs = cells.filter(function(cell) {
        return cell.column.businessObject && cell.column.businessObject.outputDefinition;
      });
      for(i = 0; i < outputs.length; i++) {
        if(outputs[i].column.previous.businessObject.inputExpression) {
          // first cell of the outputs array has the colspan attribute set
          outputs[i].colspan = outputs.length;
          outputs[i].content = 'Output';
        }
      }
      if(cells.length > 0) {
        graphicsFactory.update('row', cells[0].row, elementRegistry.getGraphics(cells[0].row.id));
      }
    }
  }
  eventBus.on(['cells.added', 'cells.removed'], updateColspans);
}

IoLabel.$inject = [ 'eventBus', 'sheet', 'elementRegistry', 'modeling', 'graphicsFactory' ];

module.exports = IoLabel;
