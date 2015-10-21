'use strict';

var inherits = require('inherits');

var BaseElementFactory = require('table-js/lib/core/ElementFactory');


/**
 * A dmn-aware factory for table-js elements
 */
function ElementFactory(moddle, dmnFactory) {
  BaseElementFactory.call(this);

  this._moddle = moddle;
  this._dmnFactory = dmnFactory;
}

inherits(ElementFactory, BaseElementFactory);


ElementFactory.$inject = [ 'moddle', 'dmnFactory' ];

module.exports = ElementFactory;

ElementFactory.prototype.baseCreate = BaseElementFactory.prototype.create;

ElementFactory.prototype.create = function(elementType, attrs) {
  attrs = attrs || {};

  var businessObject = attrs.businessObject;
  if(elementType === 'row') {
    attrs.type = 'dmn:DecisionRule';
  } else if(elementType === 'column') {
    attrs.type = 'dmn:Clause';
  }

  if (!businessObject) {
    if (!attrs.type) {
      throw new Error('no type specified');
    }
    else if(attrs.type === 'dmn:DecisionRule') {
      businessObject = this._dmnFactory.createRule(attrs.type, attrs);
    } else if(attrs.type === 'dmn:Clause') {
      if(attrs.isInput) {
        businessObject = this._dmnFactory.createInputClause(attrs.name);
        businessObject.inputExpression.itemDefinition.ref = this._dmnFactory.createItemDefinition();
        businessObject.inputExpression.itemDefinition.href = '#' + businessObject.inputExpression.itemDefinition.ref.id;
      } else {
        businessObject = this._dmnFactory.createOutputClause(attrs.name);
        businessObject.outputDefinition.ref = this._dmnFactory.createItemDefinition();
        businessObject.outputDefinition.href = '#' + businessObject.outputDefinition.ref.id;
      }
    } else {
      businessObject = this._dmnFactory.create(attrs.type);
    }
  }

  attrs.businessObject = businessObject;
  attrs.id = businessObject.id;

  return this.baseCreate(elementType, attrs);

};
