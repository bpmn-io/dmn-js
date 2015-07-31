'use strict';

var inherits = require('inherits');

var BaseModeling = require('table-js/lib/features/modeling/Modeling');

var EditCellHandler = require('./cmd/EditCellHandler');
var EditInputMappingHandler = require('./cmd/EditInputMappingHandler');
var EditIdHandler = require('./cmd/EditIdHandler');


/**
 * DMN modeling features activator
 *
 * @param {EventBus} eventBus
 * @param {ElementFactory} elementFactory
 * @param {CommandStack} commandStack
 */
function Modeling(eventBus, elementFactory, commandStack, sheet, elementRegistry) {
  BaseModeling.call(this, eventBus, elementFactory, commandStack, sheet);

  this._elementRegistry = elementRegistry;
}

inherits(Modeling, BaseModeling);

Modeling.$inject = [ 'eventBus', 'elementFactory', 'commandStack', 'sheet', 'elementRegistry' ];

module.exports = Modeling;


Modeling.prototype.getHandlers = function() {
  var handlers = BaseModeling.prototype.getHandlers.call(this);

  handlers['cell.edit'] = EditCellHandler;
  handlers['inputMapping.edit'] = EditInputMappingHandler;
  handlers['id.edit'] = EditIdHandler;

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

  if(cell.row.isClauseRow) {
    // change the clause name
    if(cell.column.businessObject.name !== content) {
      this._commandStack.execute('cell.edit', context);
    }
  } else if(cell.row.isMappingsRow) {
    if(cell.content.output !== content) {
      this._commandStack.execute('cell.edit', context);
    }
  } else if(!cell.row.isHead) {
    var previousContent = cell.content;
    if((!cell.column.isAnnotationsColumn && (!previousContent && context.content !== '') || (previousContent && context.content !== previousContent.text)) ||
       (cell.column.isAnnotationsColumn && cell.row.businessObject.description !== context.content)) {
      // only execute edit command if content changed
      this._commandStack.execute('cell.edit', context);
    }
  }


  return context;
};


Modeling.prototype.editInputMapping = function(cell, newMapping, language) {
  var context = {
    cell: cell,
    newMapping: newMapping
  };
  if(arguments.length === 3) {
    // if script is used
    context.language = language;
  }

  if(cell.content.text !== newMapping || cell.content.expressionLanguage !== language) {
    this._commandStack.execute('inputMapping.edit', context);
  }

  return context;
};

// allows editing of the table id
Modeling.prototype.editId = function(newId) {
  var context = {
    newId: newId
  };

  this._commandStack.execute('id.edit', context);

  return context;
};
