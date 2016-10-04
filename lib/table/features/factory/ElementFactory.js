'use strict';

var inherits = require('inherits');

var BaseElementFactory = require('table-js/lib/core/ElementFactory');


/**
 * A dmn-aware factory for table-js elements
 */
function ElementFactory(moddle, tableFactory) {
  BaseElementFactory.call(this);

  this._moddle = moddle;
  this._tableFactory = tableFactory;
}

inherits(ElementFactory, BaseElementFactory);


ElementFactory.$inject = [ 'moddle', 'tableFactory' ];

module.exports = ElementFactory;

ElementFactory.prototype.baseCreate = BaseElementFactory.prototype.create;

ElementFactory.prototype.create = function(elementType, attrs) {
  var tableFactory = this._tableFactory;

  attrs = attrs || {};

  var businessObject = attrs.businessObject;
  if (elementType === 'row') {
    attrs.type = 'dmn:DecisionRule';
  } else if (elementType === 'column' && !attrs.type) {
    attrs.type = attrs.isInput ? 'dmn:InputClause' : 'dmn:OutputClause';
  }

  if (!businessObject) {
    if (!attrs.type) {
      throw new Error('no type specified');
    }
    else if (attrs.type === 'dmn:DecisionRule') {
      businessObject = tableFactory.createRule(attrs.id);
    } else if (elementType === 'column') {
      if (attrs.isInput) {
        businessObject = tableFactory.createInputClause(attrs.name);
      } else {
        businessObject = tableFactory.createOutputClause(attrs.name);
      }
    } else {
      businessObject = tableFactory.create(attrs.type);
    }
  }

  attrs.businessObject = businessObject;
  attrs.id = businessObject.id;

  return this.baseCreate(elementType, attrs);

};
