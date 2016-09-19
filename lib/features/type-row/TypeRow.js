'use strict';

var assign = require('lodash/object/assign');

var domify = require('min-dom/lib/domify'),
    domClasses = require('min-dom/lib/classes'),
    ComboBox = require('table-js/lib/features/combo-box');

var typeTemplate = require('./TypeTemplate.html');

var OFFSET_X = -4,
    OFFSET_Y = -17;

/**
 * Adds a control to the table to define the datatypes for clauses
 */
function TypeRow(eventBus, sheet, elementRegistry, graphicsFactory, complexCell, rules, simpleMode) {

  this._eventBus = eventBus;
  this._graphicsFactory = graphicsFactory;
  this.row = null;

  var self = this;

  // add row when the sheet is initialized
  eventBus.on([ 'sheet.init', 'sheet.cleared' ], function(event) {

    eventBus.fire('typeRow.add', event);

    this.row = sheet.addRow({
      id: 'typeRow',
      isHead: true,
      isTypeRow: true
    });

    eventBus.fire('typeRow.added', this.row);

    graphicsFactory.update('row', this.row, elementRegistry.getGraphics(this.row.id));
  }, this);

  // remove the row when the sheet is destroyed
  eventBus.on([ 'sheet.clear', 'sheet.destroy' ], function(event) {

    eventBus.fire('typeRow.destroy', this.row);

    sheet.removeRow({
      id: 'typeRow'
    });

    eventBus.fire('typeRow.destroyed', this.row);

    this.row = null;
  }, this);

  // when an input cell on the mappings row is added, setup the complex cell
  eventBus.on('cell.added', function(evt) {
    if (evt.element.row.id === 'typeRow' &&
       evt.element.column.businessObject) {

      evt.element.content = evt.element.column.businessObject;

      var template = domify(typeTemplate);

      var isOutput = evt.element.column.type === 'dmn:OutputClause';
      if (isOutput) {
        template.querySelector('.allowed-values label').textContent = 'Output Values:';
      }

      // initializing the comboBox
      var comboBox = new ComboBox({
        label: 'Type',
        classNames: [ 'dmn-combobox', 'datatype' ],
        options: [ 'string', 'boolean', 'integer', 'long', 'double', 'date' ],
        dropdownClassNames: [ 'dmn-combobox-suggestions' ]
      });

      comboBox.addEventListener('valueChanged', function(valueEvent) {
        if (valueEvent.oldValue !== valueEvent.newValue) {
          eventBus.fire('typeRow.editDataType', {
            element: evt.element,
            dataType: valueEvent.newValue
          });

          self.updateAllowedValues(template, evt.element);

          // force redraw of potential dropdowns by toggling simple mode twice
          simpleMode.toggle();
          simpleMode.toggle();
        }
      });

      // add comboBox to the template
      template.insertBefore(
        comboBox.getNode(),
        template.firstChild
      );

      template.querySelector('.allowed-values input').addEventListener('keydown', function(keyboardEvt) {
        if (keyboardEvt.keyCode === 13) {
          self.handleValuesFromInput(evt.element, template);
        }
      });

      self.updateAllowedValues(template, evt.element);

      // set the complex property to initialize complex-cell behavior
      evt.element.complex = {
        className: 'dmn-clausevalues-setter',
        template: template,
        element: evt.element,
        comboBox: comboBox,
        type: 'type',
        offset: {
          x: 0,
          y: OFFSET_Y
        }
      };

      graphicsFactory.update('cell', evt.element, elementRegistry.getGraphics(evt.element));
    }
  });

  eventBus.on('complexCell.close', function(evt) {
    var config = evt.config,
        template;

    // only if the closed complexCell is a type cell
    if (config.type === 'type') {
      template = config.template;

      // only if it has string type and content in the input field
      if (config.comboBox.getValue() === 'string' && template.querySelector('.allowed-values input').value.trim() !== '') {
        self.handleValuesFromInput(config.element, template);
      }

    }
  });


  // whenever an type cell is opened, we have to position the template, because the x offset changes
  // over time, when columns are added and deleted
  eventBus.on('complexCell.open', function(evt) {
    var config = evt.config,
        template, gfx, content;

    if (config.type === 'type') {
      gfx = elementRegistry.getGraphics(config.element);
      // feed the values to the template and combobox
      content = config.element.content;

      if (content.inputExpression) {
        config.comboBox.setValue(content.inputExpression.typeRef);
      } else {
        config.comboBox.setValue(content.typeRef);
      }

      template = config.template;

      assign(template.parentNode.style, {
        left: (template.parentNode.offsetLeft + gfx.offsetWidth + OFFSET_X) + 'px'
      });

      // disable all input fields if editing is not allowed
      if (!rules.allowed('dataType.edit')) {
        config.comboBox.disable();

        // also set a disabled css class on the template
        domClasses(template.parentNode).add('read-only');
      }
    }
  });

}

TypeRow.prototype.handleValuesFromInput = function(element, template) {
  var inputNode = template.querySelector('.allowed-values input');

  var values = inputNode.value.split(',');
  var self = this;
  values.forEach(function(value) {
    self.addAllowedValue(element, value.trim());
  });
  this.updateAllowedValues(template, element);
  inputNode.value = '';
};

TypeRow.prototype.addAllowedValue = function(businessObject, newValue) {
  this._eventBus.fire('typeRow.addAllowedValue', {
    element: businessObject,
    value: newValue
  });
};

TypeRow.prototype.removeAllowedValue = function(businessObject, value) {
  this._eventBus.fire('typeRow.removeAllowedValue', {
    element: businessObject,
    value: value
  });
};

TypeRow.prototype.updateAllowedValues = function(template, businessObject) {
  var self = this;

  var type = businessObject.content.inputExpression && businessObject.content.inputExpression.typeRef ||
             businessObject.content.typeRef;

  if (type === 'string') {
    template.querySelector('.allowed-values').style.display = 'block';

    // clear the list of current allowed values
    var list = template.querySelector('.allowed-values ul');
    list.innerHTML = '';

    // add a list of allowed values
    if (businessObject.content.inputValues && businessObject.content.inputValues.text ||
       businessObject.content.outputValues && businessObject.content.outputValues.text) {

      var values;
      if (businessObject.content.inputValues) {
        values = businessObject.content.inputValues.text.split(',');
      } else {
        values = businessObject.content.outputValues.text.split(',');
      }

      values.forEach(function(value) {
        var element = domify('<li><span class="value-text">'+value.substr(1, value.length - 2)+'</span><button class="dmn-icon-clear"></button></li>');
        element.querySelector('button').addEventListener('click', function() {
          self.removeAllowedValue(businessObject, value);
          self.updateAllowedValues(template, businessObject);
        });
        list.appendChild(element);
      });
    }
  } else {
    template.querySelector('.allowed-values').style.display = 'none';
  }

  this._eventBus.fire('typeRow.editAllowedValues', {
    element: businessObject,
    values: values
  });

  this._graphicsFactory.redraw();
};

TypeRow.$inject = [ 'eventBus', 'sheet', 'elementRegistry', 'graphicsFactory', 'complexCell', 'rules', 'simpleMode' ];

module.exports = TypeRow;

TypeRow.prototype.getRow = function() {
  return this.row;
};
