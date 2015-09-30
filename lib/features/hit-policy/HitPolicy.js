'use strict';

var domify = require('min-dom/lib/domify'),
    ComboBox = require('table-js/lib/features/combo-box'),
    assign = require('lodash/object/assign'),
    domClasses = require('min-dom/lib/classes');

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
    if(event.element && event.element.businessObject.$instanceOf('dmn:DecisionTable')) {
      self.table = event.element.businessObject;
    }
  });

  eventBus.on('cell.added', function(event) {

    if(event.element.column === utilityColumn.getColumn() &&
       event.element.row.id==='ioLabel') {
        self.hitPolicyCell = event.element;

        // initializing the comboBox
        var comboBox = new ComboBox({
          label: 'Hit Policy',
          classNames: ['dmn-combobox', 'datatype'],
          options: ['UNIQUE', 'FIRST', 'PRIORITY', 'ANY', 'COLLECT', 'RULE ORDER', 'OUTPUT ORDER'],
          dropdownClassNames: ['dmn-combobox-suggestions']
        });

        var template = domify('<div>');

        template.insertBefore(
          comboBox.getNode(),
          template.firstChild
        );

        event.element.complex = {
          className: 'dmn-clausevalues-setter',
          template: template,
          element: event.element,
          comboBox: comboBox,
          type: 'hitPolicy',
          offset: {
            x: 0,
            y: 0
          }
        };
    }

  });


  // whenever an type cell is opened, we have to position the template, apply the model value and
  // potentially disable inputs
  eventBus.on('complexCell.open', function(evt) {
    if(evt.config.type === 'hitPolicy') {
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
      evt.config.comboBox.setValue(self.getHitPolicy());

      var template = evt.config.template;

      // focus the combobox input field
      template.querySelector('.dmn-combobox > input').focus();

      // disable all input fields if editing is not allowed
      if(!rules.allowed('hitPolicy.edit')) {
        var inputs = template.querySelectorAll('input');
        for(var i = 0; i < inputs.length; i++) {
          inputs[i].setAttribute('disabled', 'true');
        }
        evt.config.comboBox.disable();

        // also set a disabled css class on the template
        domClasses(template.parentNode).add('read-only');
      }
    }
  });


  // whenever a datatype cell is closed, apply the changes to the underlying model
  eventBus.on('complexCell.close', function(evt) {
    if(evt.config.type === 'hitPolicy') {
      eventBus.fire('hitPolicy.edit', {
        table: self.table,
        hitPolicy: evt.config.comboBox.getValue()
      });

      graphicsFactory.update('cell', self.getCell(), elementRegistry.getGraphics(self.getCell()));
    }
  });

}

HitPolicy.$inject = [ 'eventBus', 'utilityColumn', 'ioLabel', 'graphicsFactory', 'elementRegistry', 'rules' ];

HitPolicy.prototype.getCell = function() {
  return this.hitPolicyCell;
};

HitPolicy.prototype.getHitPolicy = function() {
  return (this.table && this.table.hitPolicy) || '';
};

module.exports = HitPolicy;

