'use strict';

var fs = require('fs');

var domify = require('min-dom/lib/domify'),
    domClasses = require('min-dom/lib/classes'),
    ComboBox = require('table-js/lib/features/combo-box');

/**
 * Adds a control to the table to define the datatypes for clauses
 */
function TypeRow(eventBus, sheet, elementRegistry, graphicsFactory, complexCell, rules) {

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

      evt.element.content = evt.element.column.businessObject;

      var template = domify(fs.readFileSync(__dirname + '/TypeTemplate.html', 'utf-8'));

      // initializing the comboBox
      var comboBox = new ComboBox({
        label: 'Type',
        classNames: ['dmn-combobox', 'datatype'],
        options: ['string', 'boolean', 'integer', 'long', 'double', 'date'],
        dropdownClassNames: ['dmn-combobox-suggestions']
      });

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
          y: -15
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

      evt.container.style.left = window.parseInt(evt.container.style.left, 10) + gfx.clientWidth + 'px';

      // feed the values to the template and combobox
      var content = evt.config.element.content;
      if(content.inputExpression) {
        evt.config.comboBox.setValue(content.inputExpression.typeRef);
      } else {
        evt.config.comboBox.setValue(content.typeRef);
      }

      var template = evt.config.template;

      // disable all input fields if editing is not allowed
      if(!rules.allowed('dataType.edit')) {
        evt.config.comboBox.disable();

        // also set a disabled css class on the template
        domClasses(template.parentNode).add('read-only');
      }
    }
  });

  // whenever a datatype cell is closed, apply the changes to the underlying model
  eventBus.on('complexCell.close', function(evt) {
    if(evt.config.type === 'type') {
      if(evt.config.comboBox.getValue().toLowerCase() === 'string') {

        eventBus.fire('typeRow.editDataType', {
          element: evt.config.element,
          dataType: evt.config.comboBox.getValue()
        });

      } else {
        eventBus.fire('typeRow.editDataType', {
          element: evt.config.element,
          dataType: evt.config.comboBox.getValue()
        });

      }
    }
  });

}

TypeRow.$inject = [ 'eventBus', 'sheet', 'elementRegistry', 'graphicsFactory', 'complexCell', 'rules' ];

module.exports = TypeRow;

TypeRow.prototype.getRow = function() {
  return this.row;
};
