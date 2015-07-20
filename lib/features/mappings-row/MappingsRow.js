'use strict';

var domify = require('min-dom/lib/domify'),
    forEach = require('lodash/collection/forEach');

// document wide unique overlay ids
var ids = new (require('diagram-js/lib/util/IdGenerator'))('clause');

/**
 * Adds a control to the table to add more rows
 *
 * @param {EventBus} eventBus
 */
function MappingsRow(eventBus, sheet, elementRegistry, modeling, graphicsFactory, complexCell) {

  this.row = null;

  var self = this;
  eventBus.on('sheet.init', function(event) {

    eventBus.fire('mappingsRow.add', event);

    self.row = sheet.addRow({
      id: 'mappingsRow',
      isHead: true,
      isMappingsRow: true
    });

    eventBus.fire('mappingsRow.added', self.row);

    graphicsFactory.update('row', self.row, elementRegistry.getGraphics(self.row.id));
  });

  eventBus.on('sheet.destroy', function(event) {

    eventBus.fire('mappingsRow.destroy', self.row);

    sheet.removeRow({
      id: 'mappingsRow'
    });

    eventBus.fire('mappingsRow.destroyed', self.row);
  });

  eventBus.on('cell.added', function(evt) {
    if(evt.element.row.id === 'mappingsRow' &&
       evt.element.column.businessObject &&
       evt.element.column.businessObject.inputExpression) {

      evt.element.content = evt.element.column.businessObject.inputExpression;

      var template = domify('<div class="expression region"><div class="row link"><a class="toggle-script use-script">Use script</a><span class="icon-dmn icon-clear"></span></div><div class="row fields"><label>Expression:</label><input placeholder="${propertyName}" value="'+evt.element.content.text+'"/></div></div>');

      template.querySelector('.icon-clear').addEventListener('click', function() {
        complexCell.close();
      });

      evt.element.complex = {
        className: 'dmn-clauseexpression-setter',
        template: template,
        element: evt.element,
        type: 'mapping',
        offset: {
          x: 2,
          y: -40
        }
      };

      graphicsFactory.update('cell', evt.element, elementRegistry.getGraphics(evt.element));
    } else if(evt.element.row.id === 'mappingsRow' &&
              evt.element.column.businessObject) {
      evt.element.content = evt.element.column.businessObject;
      graphicsFactory.update('cell', evt.element, elementRegistry.getGraphics(evt.element));
    }

  });

  eventBus.on('complexCell.close', function(evt) {
    if(evt.config.type === 'mapping') {
      modeling.editInputMapping(evt.config.element, evt.config.template.querySelector('input').value);
    }
  });
}

MappingsRow.$inject = [ 'eventBus', 'sheet', 'elementRegistry', 'modeling', 'graphicsFactory', 'complexCell' ];

module.exports = MappingsRow;

MappingsRow.prototype.getRow = function() {
  return this.row;
};
