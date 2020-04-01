import {
  assign
} from 'min-dash';

import inherits from 'inherits';

import {
  is
} from 'dmn-js-shared/lib/util/ModelUtil';

import BaseElementFactory from 'diagram-js/lib/core/ElementFactory';

export var BUSINESS_KNOWLEDGE_MODEL_SIZE = { width: 135, height: 46 };
export var DECISION_SIZE = { width: 180, height: 80 };
export var INPUT_DATA_SIZE = { width: 125, height: 45 };
export var KNOWLEDGE_SOURCE_SIZE = { width: 100, height: 63 };


/**
 * A drd-aware factory for diagram-js shapes
 */
export default function ElementFactory(drdFactory) {
  BaseElementFactory.call(this);

  this._drdFactory = drdFactory;
}

inherits(ElementFactory, BaseElementFactory);


ElementFactory.$inject = [ 'drdFactory' ];

ElementFactory.prototype.baseCreate = BaseElementFactory.prototype.create;

ElementFactory.prototype.create = function(elementType, attrs) {
  return this.createDrdElement(elementType, attrs);
};

ElementFactory.prototype.createDrdElement = function(elementType, attrs) {
  var drdFactory = this._drdFactory;

  var size;

  attrs = attrs || {};

  var businessObject = attrs.businessObject;

  if (!businessObject) {
    if (!attrs.type) {
      throw new Error('no shape type specified');
    }

    businessObject = drdFactory.create(attrs.type);
  }

  if (!businessObject.di) {
    if (elementType === 'connection') {
      businessObject.di = drdFactory.createDiEdge(businessObject, []);
    } else if (elementType === 'shape') {
      businessObject.di = drdFactory.createDiShape(businessObject, {});
    }
  }

  size = this._getDefaultSize(businessObject);

  attrs = assign({
    businessObject: businessObject,
    id: businessObject.id
  }, size, attrs);

  return this.baseCreate(elementType, attrs);
};


ElementFactory.prototype._getDefaultSize = function(semantic) {
  if (is(semantic, 'dmn:BusinessKnowledgeModel')) {
    return BUSINESS_KNOWLEDGE_MODEL_SIZE;
  }

  if (is(semantic, 'dmn:Decision')) {
    return DECISION_SIZE;
  }

  if (is(semantic, 'dmn:InputData')) {
    return INPUT_DATA_SIZE;
  }

  if (is(semantic, 'dmn:KnowledgeSource')) {
    return KNOWLEDGE_SOURCE_SIZE;
  }

  return { width: 100, height: 80 };
};
