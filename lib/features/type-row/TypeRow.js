'use strict';

var fs = require('fs');

var domify = require('min-dom/lib/domify'),
    domClasses = require('min-dom/lib/classes'),
    assign = require('lodash/object/assign'),
    ComboBox = require('table-js/lib/features/combo-box');

/**
 * Adds a control to the table to define the datatypes for clauses
 */
function TypeRow(eventBus, sheet, elementRegistry, modeling, graphicsFactory, complexCell) {

  this.row = null;

  var self = this;

  // add row when the sheet is initialized
  eventBus.on('sheet.init', function(event) {

    eventBus.fire('typeRow.add', event);

    self.row = sheet.addRow({
      id: 'typeRow',
      isHead: true,
      isTypeRow: true
    });

    eventBus.fire('typeRow.added', self.row);

    graphicsFactory.update('row', self.row, elementRegistry.getGraphics(self.row.id));
  });

  // remove the row when the sheet is destroyed
  eventBus.on('sheet.destroy', function(event) {

    eventBus.fire('typeRow.destroy', self.row);

    sheet.removeRow({
      id: 'typeRow'
    });

    eventBus.fire('typeRow.destroyed', self.row);
  });

  // when an input cell on the mappings row is added, setup the complex cell
  eventBus.on('cell.added', function(evt) {
    if(evt.element.row.id === 'typeRow' &&
       evt.element.column.businessObject) {

      // cell content is the item Definition of the clause
      if(evt.element.column.businessObject.inputExpression) {
        evt.element.content = evt.element.column.businessObject.inputExpression.itemDefinition.ref;
      } else if(evt.element.column.businessObject.outputDefinition) {
        evt.element.content = evt.element.column.businessObject.outputDefinition.ref;
      }

      var template = domify(fs.readFileSync(__dirname + '/TypeTemplate.html', 'utf-8'));

      // initializing the comboBox
      var comboBox = new ComboBox({
        label: 'Type',
        classNames: ['dmn-combobox', 'datatype'],
        options: ['string', 'date', 'short', 'int', 'long', 'float', 'double', 'boolean'],
        dropdownClassNames: ['dmn-combobox-suggestions']
      });

      comboBox.setValue(evt.element.content.typeDefinition);

      // add comboBox to the template
      template.insertBefore(
        comboBox.getNode(),
        template.firstChild
      );

      // set the complex property to initialize complex-cell behavior
      evt.element.complex = {
        className: 'dmn-clausevalues-setter',
        template: template,
        element: evt.element,
        comboBox: comboBox,
        type: 'type',
        offset: {
          x: 0,
          y: 0
        }
      };

      graphicsFactory.update('cell', evt.element, elementRegistry.getGraphics(evt.element));
    }
  });


  // whenever an type cell is opened, we have to position the template, because the x offset changes
  // over time, when columns are added and deleted
  eventBus.on('complexCell.open', function(evt) {
    if(evt.config.type === 'type') {
      var gfx = elementRegistry.getGraphics(evt.config.element);

      // traverse the offset parent chain to find the offset sum
      var e = gfx;
      var offset = {x:0,y:0};
      while (e)
      {
          offset.x += e.offsetLeft;
          offset.y += e.offsetTop;
          e = e.offsetParent;
      }

      assign(evt.container.style, {
        left: (offset.x + gfx.clientWidth) + 'px',
        top: (offset.y - 15)  + 'px',
        width: 'auto',
        height: 'auto'
      });
    }
  });

  // whenever a datatype cell is closed, apply the changes to the underlying model
  eventBus.on('complexCell.close', function(evt) {
    if(evt.config.type === 'type') {
      modeling.editDataType(
        evt.config.element,
        evt.config.comboBox.getValue()
      );
    }
  });

}

TypeRow.$inject = [ 'eventBus', 'sheet', 'elementRegistry', 'modeling', 'graphicsFactory', 'complexCell' ];

module.exports = TypeRow;

TypeRow.prototype.getRow = function() {
  return this.row;
};
