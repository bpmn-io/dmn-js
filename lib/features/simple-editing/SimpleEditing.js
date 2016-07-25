'use strict';

var inherits = require('inherits');

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

  eventBus.on('selection.changed', function(evt) {
    if(simpleMode.isSimple() && evt.newSelection) {
      var bo = elementRegistry.get(evt.newSelection.column.id).businessObject;
      if(bo &&
        (bo.inputExpression &&
         bo.inputExpression.typeRef === 'boolean' ||
         bo.typeRef === 'boolean')) {

        var node = elementRegistry.getGraphics(evt.newSelection.id).querySelector('select');
        var e;
        e = document.createEvent('MouseEvents');
        e.initMouseEvent('mousedown', true, true, window);
        node.dispatchEvent(e);


      }
    }
  });

  this.preExecute([ 'cell.edit' ], function(evt) {
    if(simpleMode.isSimple()) {
      // check if the cell to be edited is of type string
      var bo = elementRegistry.get(evt.context.column).businessObject;

      var isHead = elementRegistry.get(evt.context.row).isHead;

      if(bo &&
         !isHead &&
        (bo.inputExpression &&
         bo.inputExpression.typeRef === 'string' ||
         bo.typeRef === 'string')) {

        // wrap string in quotes
        if(evt.context.content) {
          evt.context.content = '"' + evt.context.content + '"';
        }

      }
    }
  });

}

inherits(SimpleEditing, CommandInterceptor);
SimpleEditing.$inject = [ 'eventBus', 'modeling', 'simpleMode', 'elementRegistry', 'graphicsFactory' ];

module.exports = SimpleEditing;
