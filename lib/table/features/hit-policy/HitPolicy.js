'use strict';

var domify = require('min-dom/lib/domify'),
    domClasses = require('min-dom/lib/classes');

var ComboBox = require('table-js/lib/features/combo-box');

var OFFSET_X = 36,
    OFFSET_Y = -16;

/**
 * Adds behavior to display and set the hit policy of a table
 *
 * @param {EventBus} eventBus
 */
function HitPolicy(eventBus, utilityColumn, ioLabel, graphicsFactory, elementRegistry, rules) {

  this.table = null;
  this.hitPolicyCell = null;

  var self = this;
  eventBus.on('dmnElement.added', function(event) {
    if (event.element && event.element.businessObject.$instanceOf('dmn:DecisionTable')) {
      self.table = event.element.businessObject;
    }
  });

  eventBus.on('cell.added', function(event) {

    if (event.element.column === utilityColumn.getColumn() &&
       event.element.row.id==='ioLabel') {
      self.hitPolicyCell = event.element;

      self.hitPolicyCell.rowspan = 4;

      var template = domify('<div>');

        // initializing the comboBox
      var comboBox = new ComboBox({
        label: 'Hit Policy',
        classNames: ['dmn-combobox', 'hitpolicy'],
        options: ['UNIQUE', 'FIRST', 'PRIORITY', 'ANY', 'COLLECT', 'RULE ORDER', 'OUTPUT ORDER'],
        dropdownClassNames: ['dmn-combobox-suggestions']
      });

      template.insertBefore(
          comboBox.getNode(),
          template.firstChild
        );

      var operatorComboBox = new ComboBox({
        label: 'Collect Operator',
        classNames: ['dmn-combobox', 'operator'],
        options: ['LIST', 'SUM', 'MIN', 'MAX', 'COUNT'],
        dropdownClassNames: ['dmn-combobox-suggestions']
      });

      template.appendChild(operatorComboBox.getNode());

        // display and hide the operatorComboBox based on the selected hit policy
      comboBox.addEventListener('valueChanged', function(evt) {
        if (evt.newValue.toLowerCase() === 'collect') {
          operatorComboBox.getNode().style.display = 'table';
        } else {
          operatorComboBox.getNode().style.display = 'none';
        }
      });

      event.element.complex = {
        className: 'dmn-hitpolicy-setter',
        template: template,
        element: event.element,
        comboBox: comboBox,
        operatorComboBox: operatorComboBox,
        type: 'hitPolicy',
        offset: {
          x: OFFSET_X,
          y: OFFSET_Y
        }
      };
    }

  });

  // whenever an type cell is opened, we have to position the template, apply the model value and
  // potentially disable inputs
  eventBus.on('complexCell.open', function(evt) {
    var config = evt.config;

    if (config.type === 'hitPolicy') {

      // feed the values to the template and combobox
      config.comboBox.setValue(self.getHitPolicy());
      config.operatorComboBox.setValue(self.getAggregation());

      var template = config.template;

      // focus the combobox input field
      template.querySelector('.dmn-combobox > input').focus();

      // disable all input fields if editing is not allowed
      if (!rules.allowed('hitPolicy.edit')) {
        var inputs = template.querySelectorAll('input');
        for (var i = 0; i < inputs.length; i++) {
          inputs[i].setAttribute('disabled', 'true');
        }
        config.comboBox.disable();

        // also set a disabled css class on the template
        domClasses(template.parentNode).add('read-only');
      }
    }
  }, this);


  // whenever a datatype cell is closed, apply the changes to the underlying model
  eventBus.on('complexCell.close', function(evt) {
    if (evt.config.type === 'hitPolicy') {
      eventBus.fire('hitPolicy.edit', {
        table: self.table,
        hitPolicy: evt.config.comboBox.getValue(),
        aggregation: evt.config.comboBox.getValue() === 'COLLECT' ? evt.config.operatorComboBox.getValue() : undefined,
        cell: self.getCell()
      });

      graphicsFactory.update('cell', self.getCell(), elementRegistry.getGraphics(self.getCell()));
    }
  });

}

HitPolicy.$inject = [
  'eventBus', 'utilityColumn', 'ioLabel',
  'graphicsFactory', 'elementRegistry', 'rules'
];

HitPolicy.prototype.getCell = function() {
  return this.hitPolicyCell;
};

HitPolicy.prototype.getHitPolicy = function() {
  return (this.table && this.table.hitPolicy) || '';
};

HitPolicy.prototype.getAggregation = function() {
  return (this.table && this.table.aggregation) || 'LIST';
};

module.exports = HitPolicy;
