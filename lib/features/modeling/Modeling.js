'use strict';

var inherits = require('inherits');

var BaseModeling = require('table-js/lib/features/modeling/Modeling');

var EditCellHandler = require('./cmd/EditCellHandler');
var ClearRowHandler = require('./cmd/ClearRowHandler');
var EditInputMappingHandler = require('./cmd/EditInputMappingHandler');
var EditIdHandler = require('./cmd/EditIdHandler');
var EditTypeHandler = require('./cmd/EditTypeHandler');
var EditHitPolicyHandler = require('./cmd/EditHitPolicyHandler');


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

  // TODO: move this to a subclass of editBehavior
  var self = this;
  eventBus.on('tableName.editId', function(event) {
    self.editId(event.newId);
  });

  eventBus.on('ioLabel.createColumn', function(event) {
    self.createColumn(event.newColumn);
  });

  eventBus.on('mappingsRow.editInputMapping', function(event) {
    self.editInputMapping(
      event.element,
      event.expression,
      event.language
    );
  });

  eventBus.on('typeRow.editDataType', function(event) {
    self.editDataType(
      event.element,
      event.dataType,
      event.allowedValues
    );
  });

  eventBus.on('hitPolicy.edit', function(event) {
    self.editHitPolicy(
      event.table,
      event.hitPolicy,
      event.aggregation,
      event.cell
    );
  });
}

inherits(Modeling, BaseModeling);

Modeling.$inject = [ 'eventBus', 'elementFactory', 'commandStack', 'sheet', 'elementRegistry' ];

module.exports = Modeling;


Modeling.prototype.getHandlers = function() {
  var handlers = BaseModeling.prototype.getHandlers.call(this);

  handlers['cell.edit'] = EditCellHandler;
  handlers['row.clear'] = ClearRowHandler;
  handlers['inputMapping.edit'] = EditInputMappingHandler;
  handlers['id.edit'] = EditIdHandler;
  handlers['dataType.edit'] = EditTypeHandler;
  handlers['hitPolicy.edit'] = EditHitPolicyHandler;

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
    // change the clause label
    if(cell.column.businessObject.label !== content) {
      this._commandStack.execute('cell.edit', context);
    }
  } else if(cell.row.isMappingsRow) {
    if(cell.content.name !== content) {
      this._commandStack.execute('cell.edit', context);
    }
  } else if(!cell.row.isHead) {
    var previousContent = cell.content;
    if((!cell.column.isAnnotationsColumn && (!previousContent && context.content !== '') ||
       (previousContent && context.content !== previousContent.text)) ||
       (cell.column.isAnnotationsColumn && cell.row.businessObject.description !== context.content)) {
      // only execute edit command if content changed
      this._commandStack.execute('cell.edit', context);
    }
  }

  return context;
};

Modeling.prototype.editHitPolicy = function(table, newPolicy, aggregation, cell) {
  var context = {
    table: table,
    newPolicy: newPolicy,
    newAggregation: aggregation,
    cell: cell
  };

  if(!context.newAggregation || context.newAggregation === 'LIST') {
    context.newAggregation = undefined;
  }

  if(table.hitPolicy !== newPolicy ||
    (!table.aggregation && context.newAggregation) ||
     table.aggregation !== context.newAggregation) {

    this._commandStack.execute('hitPolicy.edit', context);
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

Modeling.prototype.editDataType = function(cell, newType, allowedValues) {
  var context = {
    cell: cell,
    newType: newType
  };
  if(arguments.length === 3) {
    // when allowed values are provided
    context.allowedValues = allowedValues;
  }

  var allowedValuesChanged = false;

  // changed if the number of entries is different
  if(!cell.content.allowedValue && allowedValues ||
      cell.content.allowedValue && !allowedValues  ||
      cell.content.allowedValue && allowedValues && cell.content.allowedValue.length !== allowedValues.length) {
        allowedValuesChanged = true;
  } else

  // changed if at least one entry is different from before
  if(cell.content.allowedValue && allowedValues) {
    for(var i = 0; i < allowedValues.length; i++) {
      if(cell.content.allowedValue[i].text !== allowedValues[i]) {
        allowedValuesChanged = true;
        break;
      }
    }
  }


  if(cell.content.typeDefinition !== newType || allowedValuesChanged) {
    this._commandStack.execute('dataType.edit', context);
  }

  return context;
};
