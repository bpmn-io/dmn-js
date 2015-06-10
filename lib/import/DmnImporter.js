'use strict';

var assign = require('lodash/object/assign');

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
function DmnImporter(eventBus, sheet, elementRegistry, elementFactory) {
  this._eventBus = eventBus;
  this._sheet = sheet;

  this._elementRegistry = elementRegistry;
  this._elementFactory = elementFactory;
}

DmnImporter.$inject = [ 'eventBus', 'sheet', 'elementRegistry', 'elementFactory' ];

module.exports = DmnImporter;


/**
 * Add dmn element (semantic) to the sheet onto the
 * parent element.
 */
DmnImporter.prototype.add = function(semantic, parentElement) {

  var element;

  if (semantic.$instanceOf('dmn:DecisionTable')) {
    // Don't do anything and use the default root element
  }

  // CLAUSE
  else if (semantic.$instanceOf('dmn:Clause')) {

    element = this._elementFactory.createColumn(elementData(semantic, {

    }));

    this._sheet.addColumn(element, parentElement);
  }

  // RULE
  else if (semantic.$instanceOf('dmn:DecisionRule')) {

    element = this._elementFactory.createRow(elementData(semantic, {

    }));
    this._sheet.addRow(element, parentElement);

  }

  // CELL
  else if (semantic.$instanceOf('dmn:LiteralExpression')) {

    // now I have to get the ID of the row and the column
    var column = this._elementRegistry.filter(function(ea) {
      return ea.businessObject === semantic.$parent;
    })[0].id;

    var row = this._elementRegistry.filter(function(ea) {
      return ea.businessObject === parentElement;
    })[0].id;

    this._sheet.setCellContent({
      row: row,
      column: column,
      content: semantic.text
    });
  } else {
    throw new Error('can not render element ' + elementToString(semantic));
  }

  this._eventBus.fire('dmnElement.added', { element: element });

  return element;
};
