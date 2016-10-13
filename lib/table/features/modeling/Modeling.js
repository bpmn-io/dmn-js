'use strict';

var inherits = require('inherits');

var BaseModeling = require('table-js/lib/features/modeling/Modeling');

var EditCellHandler = require('./cmd/EditCellHandler'),
    ClearRowHandler = require('./cmd/ClearRowHandler'),
    EditInputMappingHandler = require('./cmd/EditInputMappingHandler'),
    EditIdHandler = require('./cmd/EditIdHandler'),
    EditTypeHandler = require('./cmd/EditTypeHandler'),
    EditHitPolicyHandler = require('./cmd/EditHitPolicyHandler'),
    EditLiteralExpressionHandler = require('./cmd/EditLiteralExpressionHandler'),
    EditCellExpressionLanguageHandler = require('./cmd/EditCellExpressionLanguageHandler'),
    EditDescriptionHandler = require('./cmd/EditDescriptionHandler'),
    CopyRowHandler = require('./cmd/CopyRowHandler'),
    AddAllowedValueHandler = require('./cmd/AddAllowedValueHandler'),
    RemoveAllowedValueHandler = require('./cmd/RemoveAllowedValueHandler');


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
  eventBus.on('tableName.editId', function(event) {
    this.editId(event.newId);
  }, this);

  eventBus.on('typeRow.editDataType', function(event) {
    this.editDataType( event.element, event.dataType, event.allowedValues);
  }, this);

  eventBus.on('mappingsRow.editInputMapping', function(event) {
    this.editInputMapping(event.element, event.attrs);
  }, this);

  eventBus.on('hitPolicy.edit', function(event) {
    this.editHitPolicy(event.table, event.hitPolicy, event.aggregation, event.cell);
  }, this);

  eventBus.on('literalExpression.edit', function(event) {
    this.editLiteralExpression(event.decision, event.text, event.variableName, event.variableType, event.language);
  }, this);

  eventBus.on('ioLabel.createColumn', function(event) {
    this.createColumn(event.newColumn);
  }, this);

  eventBus.on('typeRow.addAllowedValue', function(event) {
    this.addAllowedValue(
      event.element,
      event.value
    );
  }, this);

  eventBus.on('typeRow.removeAllowedValue', function(event) {
    this.removeAllowedValue(
      event.element,
      event.value
    );
  }, this);
}

inherits(Modeling, BaseModeling);

Modeling.$inject = [ 'eventBus', 'elementFactory', 'commandStack', 'sheet', 'elementRegistry' ];

module.exports = Modeling;


Modeling.prototype.getHandlers = function() {
  var handlers = BaseModeling.prototype.getHandlers.call(this);

  handlers['cell.edit'] = EditCellHandler;

  handlers['row.clear'] = ClearRowHandler;
  handlers['row.copy'] = CopyRowHandler;

  handlers['inputMapping.edit'] = EditInputMappingHandler;
  handlers['id.edit'] = EditIdHandler;
  handlers['dataType.edit'] = EditTypeHandler;
  handlers['hitPolicy.edit'] = EditHitPolicyHandler;
  handlers['literalExpression.edit'] = EditLiteralExpressionHandler;
  handlers['cellExpressionLanguage.edit'] = EditCellExpressionLanguageHandler;
  handlers['typeRow.addAllowedValue'] = AddAllowedValueHandler;
  handlers['typeRow.removeAllowedValue'] = RemoveAllowedValueHandler;

  handlers['description.edit'] = EditDescriptionHandler;

  return handlers;
};

Modeling.prototype.removeAllowedValue = function(businessObject, value) {
  if ((!businessObject.content.inputValues || !businessObject.content.inputValues.text.indexOf('"' + value + '"') === -1) &&
     (!businessObject.content.outputValues || !businessObject.content.outputValues.text.indexOf('"' + value + '"') === -1)) {
    return;
  }

  var context = {
    businessObject: businessObject.content,
    value: value,
    isInput: businessObject.content.inputExpression
  };

  this._commandStack.execute('typeRow.removeAllowedValue', context);

  return context;
};

Modeling.prototype.addAllowedValue = function(businessObject, value) {
  if (businessObject.content.inputValues && businessObject.content.inputValues.text.indexOf('"' + value + '"') !== -1 ||
     businessObject.content.outputValues && businessObject.content.outputValues.text.indexOf('"' + value + '"') !== -1) {
    // do not add a value twice
    return;
  }

  var context = {
    businessObject: businessObject.content,
    value: value,
    isInput: !!businessObject.content.inputExpression
  };

  this._commandStack.execute('typeRow.addAllowedValue', context);

  return context;
};

Modeling.prototype.copyRow = function(row, refRow) {
  var context = {
    row: row,
    refRow: refRow
  };

  this._commandStack.execute('row.copy', context);

  return context;
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

  if (cell.row.isClauseRow) {
    // change the clause label
    if (cell.column.businessObject.label !== content) {
      this._commandStack.execute('cell.edit', context);
    }
  } else if (cell.row.isMappingsRow) {
    if (cell.content.name !== content.trim()) {
      this._commandStack.execute('cell.edit', context);
    }
  } else if (!cell.row.isHead) {

    var previousContent = cell.content;
    if ((!cell.column.isAnnotationsColumn && (!previousContent && context.content.trim() !== '') ||
       (previousContent && context.content.trim() !== previousContent.text)) ||
       (cell.column.isAnnotationsColumn && cell.row.businessObject.description !== context.content.trim())) {
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

  if (!context.newAggregation || context.newAggregation === 'LIST') {
    context.newAggregation = undefined;
  }

  if (table.hitPolicy !== newPolicy ||
    (!table.aggregation && context.newAggregation) ||
     table.aggregation !== context.newAggregation) {

    this._commandStack.execute('hitPolicy.edit', context);
  }

  return context;
};

Modeling.prototype.editLiteralExpression = function(decision, text, name, type, language) {
  var context = {
    decision: decision,
    text: text,
    name: name,
    type: type,
    language: language
  };

  this._commandStack.execute('literalExpression.edit', context);

  return context;
};


Modeling.prototype.editInputMapping = function(cell, attrs) {
  var context = {
        cell: cell,
        newMapping: attrs.expression,
        inputVariable: attrs.inputVariable,
        language: attrs.language
      },
      content = cell.content;

  if (content.text !== context.newMapping ||
      content.expressionLanguage !== context.language ||
     (content.$parent && (content.$parent.inputVariable !== context.inputVariable))) {
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

Modeling.prototype.editDataType = function(cell, newType) {
  var context = {
    cell: cell,
    newType: newType
  };

  if (cell.content.typeDefinition !== newType) {
    this._commandStack.execute('dataType.edit', context);
  }

  return context;
};

Modeling.prototype.editCellExpressionLanguage = function(businessObject, expressionLanguage) {
  var context = {
    businessObject: businessObject,
    newExpressionLanguage: expressionLanguage
  };

  this._commandStack.execute('cellExpressionLanguage.edit', context);
};

Modeling.prototype.editDescription = function(businessObject, description) {
  var context = {
    businessObject: businessObject,
    newDescription: description
  };

  this._commandStack.execute('description.edit', context);
};
