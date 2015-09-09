'use strict';

var fs = require('fs');

var domify = require('min-dom/lib/domify'),
    domClasses = require('min-dom/lib/classes'),
    domClear = require('min-dom/lib/clear'),
    assign = require('lodash/object/assign'),
    forEach = require('lodash/collection/forEach'),
    ComboBox = require('table-js/lib/features/combo-box');

/**
 * Adds a control to the table to define the datatypes for clauses
 */
function TypeRow(eventBus, sheet, elementRegistry, graphicsFactory, complexCell) {

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
        options: ['string', 'boolean', 'short', 'integer', 'long', 'double'],
        dropdownClassNames: ['dmn-combobox-suggestions']
      });

      // --- setup event listeners ---

      // display and hide the allowed value choices based on type input
      comboBox.addEventListener('valueChanged', function(evt) {
        if(evt.newValue.toLowerCase() === 'string') {
          domClasses(template.parentNode).add('choices');
        } else {
          domClasses(template.parentNode).remove('choices');
        }
      });

      // create new input fields for the allowed values list
      template.querySelector('.allowed-values ul').addEventListener('input', function(evt) {
        var list = template.querySelectorAll('.allowed-values ul li');

        // if the last element contains text, we need to add another list element for future input
        if(!!list[list.length - 1].firstChild.value) {
          var newElement = domify('<li><input tabindex="1" placeholder="Possible Value"></li>');
          template.querySelector('.allowed-values ul').appendChild(newElement);
        }
      });

      // remove empty input fields (if it is not the last one)
      template.querySelector('.allowed-values ul').addEventListener('blur', function(evt) {
        if(!evt.target.value && evt.target.parentNode.parentNode.lastChild !== evt.target.parentNode) {
          evt.target.parentNode.parentNode.removeChild(evt.target.parentNode);
        }
      }, true);


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

      // feed the values to the template and combobox
      evt.config.comboBox.setValue(evt.config.element.content.typeDefinition);

      var template = evt.config.template;
      // clear allowed values
      domClear(template.querySelector('.allowed-values ul'));

      // set the allowed values
      if(evt.config.element.content.allowedValue) {
        forEach(evt.config.element.content.allowedValue, function(allowedValue) {
          var newElement = domify('<li><input tabindex="1" placeholder="Possible Value"></li>');
          newElement.firstChild.value = allowedValue.text;
          template.querySelector('.allowed-values ul').appendChild(newElement);
        });
      }
      // add empty input field
      var newElement = domify('<li><input tabindex="1" placeholder="Possible Value"></li>');
      template.querySelector('.allowed-values ul').appendChild(newElement);

      // focus the combobox input field
      template.querySelector('.dmn-combobox > input').focus();
    }
  });

  // whenever a datatype cell is closed, apply the changes to the underlying model
  eventBus.on('complexCell.close', function(evt) {
    if(evt.config.type === 'type') {
      if(evt.config.comboBox.getValue().toLowerCase() === 'string') {

        // special string handling for allowed values
        var nodeList = evt.config.template.querySelectorAll('.allowed-values ul li');

        // node list is not an array, so we have to do the mapping manually
        var arrayOfValues = [];
        for(var i = 0; i < nodeList.length - 1; i++) {
          arrayOfValues.push(nodeList[i].firstChild.value);
        }

        eventBus.fire('typeRow.editDataType', {
          element: evt.config.element,
          dataType: evt.config.comboBox.getValue(),
          allowedValues: arrayOfValues
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

TypeRow.$inject = [ 'eventBus', 'sheet', 'elementRegistry', 'graphicsFactory', 'complexCell' ];

module.exports = TypeRow;

TypeRow.prototype.getRow = function() {
  return this.row;
};
