'use strict';

var assign = require('lodash/object/assign'),
    union  = require('lodash/array/union');

var elementToString = require('./Util').elementToString;


function elementData(semantic, attrs) {
  return assign({
    id: semantic.id,
    type: semantic.$type,
    businessObject: semantic
  }, attrs);
}


/**
 * An importer that adds dmn elements to the sheet
 *
 * @param {EventBus} eventBus
 * @param {Sheet} sheet
 * @param {ElementFactory} elementFactory
 * @param {ElementRegistry} elementRegistry
 */
function DmnImporter(eventBus, sheet, elementRegistry, elementFactory, moddle, tableName, ioLabel, dmnFactory) {
  this._eventBus = eventBus;
  this._sheet = sheet;

  this._elementRegistry = elementRegistry;
  this._elementFactory = elementFactory;
  this._tableName = tableName;
  this._dmnFactory = dmnFactory;

  this._ioLabel = ioLabel;

  this._moddle = moddle;
}

DmnImporter.$inject = [
  'eventBus', 'sheet', 'elementRegistry',
  'elementFactory', 'moddle', 'tableName',
  'ioLabel', 'dmnFactory'
];

module.exports = DmnImporter;


DmnImporter.prototype._makeCopy = function(semantic) {
  var newSemantic = this._moddle.create(semantic.$type);

  for(var prop in semantic) {
    if(semantic.hasOwnProperty(prop) && prop !== '$type') {
      newSemantic[prop] = semantic[prop];
    }
  }
  newSemantic.$parent = semantic.$parent;

  return newSemantic;
};

/**
 * Add dmn element (semantic) to the sheet onto the
 * parent element.
 */
DmnImporter.prototype.add = function(semantic, parentElement, definitions) {

  var element;

  if (semantic.$instanceOf('dmn:DecisionTable')) {
    // Add the header row
    element = this._elementFactory.createRow(elementData(semantic, {
      isHead: true,
      isClauseRow: true,
      previous: this._ioLabel.getRow()
    }));
    this._sheet.addRow(element, parentElement);

    this._tableName.setSemantic(semantic.$parent);
  }

  // INPUT CLAUSE
  else if (semantic.$instanceOf('dmn:InputClause')) {
    element = this._elementFactory.createColumn(elementData(semantic, {

    }));
    this._sheet.addColumn(element, parentElement);
  }
  // OUTPUT CLAUSE
  else if (semantic.$instanceOf('dmn:OutputClause')) {
    element = this._elementFactory.createColumn(elementData(semantic, {

    }));
    this._sheet.addColumn(element, parentElement);
  }

  // RULE
  else if (semantic.$instanceOf('dmn:DecisionRule')) {
    if(!semantic.inputEntry) {
      semantic.inputEntry = [];
    }
    if(!semantic.outputEntry) {
      semantic.outputEntry = [];
    }
    element = this._elementFactory.createRow(elementData(semantic, {

    }));
    this._sheet.addRow(element, parentElement);

  }

  // CELL
  else if (parentElement.$instanceOf('dmn:DecisionRule')) {

    // we have to find out the column of this cell. This can be done by getting the index of the
    // cell and then using the clause at this index
    var allCellsInRow = union(parentElement.inputEntry, parentElement.outputEntry);

    var allClauses = this._elementRegistry.filter(function(element) {
      if(!element.businessObject) {
        return false;
      }
      var type = element.businessObject.$type;
      return type === 'dmn:InputClause' || type === 'dmn:OutputClause';
    });

    var column = allClauses[allCellsInRow.indexOf(semantic)].id;

    var row = this._elementRegistry.filter(function(ea) {
      return ea.businessObject === parentElement;
    })[0].id;

    semantic.text = semantic.text || '';

    this._sheet.setCellContent({
      row: row,
      column: column,
      content: semantic
    });

  } else {
    throw new Error('can not render element ' + elementToString(semantic));
  }

  this._eventBus.fire('dmnElement.added', { element: element });

  return element;
};
