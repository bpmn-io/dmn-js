'use strict';

var inherits = require('inherits');

var BaseModeling = require('table-js/lib/features/modeling/Modeling');

var EditCellHandler = require('./cmd/EditCellHandler');


/**
 * DMN modeling features activator
 *
 * @param {EventBus} eventBus
 * @param {ElementFactory} elementFactory
 * @param {CommandStack} commandStack
 */
function Modeling(eventBus, elementFactory, commandStack, sheet, elementRegistry, tableName) {
  BaseModeling.call(this, eventBus, elementFactory, commandStack, sheet, tableName);

  this._elementRegistry = elementRegistry;
}

inherits(Modeling, BaseModeling);

Modeling.$inject = [ 'eventBus', 'elementFactory', 'commandStack', 'sheet', 'elementRegistry', 'tableName' ];

module.exports = Modeling;


Modeling.prototype.getHandlers = function() {
  var handlers = BaseModeling.prototype.getHandlers.call(this);

  handlers['cell.edit'] = EditCellHandler;

  return handlers;
};

Modeling.prototype.editCell = function(row, column, content) {

  var context = {
    row: row,
    column: column,
    content: content
  };

  var cell = this._elementRegistry.filter(function(element) {
      return element._type === 'cell' && element.row.id === row && element.column.id === column;
  })[0];

  if(cell.row.isHead) {
    if(cell.column.businessObject.name !== content) {
      this._commandStack.execute('cell.edit', context);
    }
  } else {
    var previousContent = cell.content;
    if((!previousContent && context.content !== '') || (previousContent && context.content !== previousContent.text)) {
      // only execute edit command if content changed
      this._commandStack.execute('cell.edit', context);
    }
  }


  return context;
};
