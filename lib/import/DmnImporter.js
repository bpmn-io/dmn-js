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
function DmnImporter(eventBus, sheet, elementRegistry, elementFactory, moddle) {
  this._eventBus = eventBus;
  this._sheet = sheet;

  this._elementRegistry = elementRegistry;
  this._elementFactory = elementFactory;

  this._moddle = moddle;

  this.usedEntries = [];
}

DmnImporter.$inject = [ 'eventBus', 'sheet', 'elementRegistry', 'elementFactory', 'moddle' ];

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
DmnImporter.prototype.add = function(semantic, parentElement) {

  var element;

  if (semantic.$instanceOf('dmn:DecisionTable')) {
    // Add the header row
    element = this._elementFactory.createRow(elementData(semantic, {
      isHead: true
    }));
    this._sheet.addRow(element, parentElement);
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

    var content = semantic;
    if(this.usedEntries.indexOf(semantic) !== -1) {
      content = this._makeCopy(semantic);
      content.id = row + '_' + column;
      content.$parent[content.$parent.inputEntry ? 'inputEntry' : 'outputEntry'].push(content);
      var ruleProp = !!content.$parent.inputEntry ? 'condition' : 'conclusion';
      parentElement[ruleProp].splice(parentElement[ruleProp].indexOf(semantic), 1, content);
    }

    this._sheet.setCellContent({
      row: row,
      column: column,
      content: content
    });

    this.usedEntries.push(content);

  } else {
    throw new Error('can not render element ' + elementToString(semantic));
  }

  this._eventBus.fire('dmnElement.added', { element: element });

  return element;
};
