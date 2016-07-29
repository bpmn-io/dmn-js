'use strict';

var inherits = require('inherits');
var domClasses = require('min-dom/lib/classes');

var CommandInterceptor = require('diagram-js/lib/command/CommandInterceptor');

function SimpleEditing(eventBus, modeling, simpleMode, elementRegistry, graphicsFactory) {

  CommandInterceptor.call(this, eventBus);

  this._eventBus = eventBus;
  this._modeling = modeling;

  eventBus.on('simpleCheckbox.render', function(evt, checkbox, data) {
    // make the checkbox editable
    checkbox.removeAttribute('disabled');

    // link the checkbox to the modeling
    checkbox.addEventListener('change', function(evt) {
      modeling.editCell(data.row.id, data.column.id, evt.target.value);
    });
  });

  eventBus.on('element.mousedown', function(event) {
    if (domClasses(event.originalEvent.target).contains('simple-mode-checkbox')) {
      // returning a non-undefined variable causes the eventBus to stop the propagation of the event
      // that leads to the behavior, that other event-handlers don't override the content of
      // the cell, which would cause the dropdown to close again
      return true;
    }
  });

  this.preExecute([ 'cell.edit' ], function(evt) {
    if (simpleMode.isSimple()) {
      // check if the cell to be edited is of type string
      var bo = elementRegistry.get(evt.context.column).businessObject;

      var isHead = elementRegistry.get(evt.context.row).isHead;

      if (bo &&
         !isHead &&
        (bo.inputExpression &&
         bo.inputExpression.typeRef === 'string' ||
         bo.typeRef === 'string')) {

        // wrap string in quotes
        if (evt.context.content) {
          evt.context.content = '"' + evt.context.content + '"';
        }

      }
    }
  });

}

inherits(SimpleEditing, CommandInterceptor);
SimpleEditing.$inject = [ 'eventBus', 'modeling', 'simpleMode', 'elementRegistry', 'graphicsFactory' ];

module.exports = SimpleEditing;
