import {
  assign
} from 'min-dash';

import inherits from 'inherits';

import {
  is
} from 'dmn-js-shared/lib/util/ModelUtil';

import BaseElementFactory from 'diagram-js/lib/core/ElementFactory';

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

  if (is(semantic, 'dmn:Decision')) {
    return { width: 180, height: 80 };
  }

  if (is(semantic, 'dmn:InputData')) {
    return { width: 125, height: 45 };
  }

  if (is(semantic, 'dmn:KnowledgeSource')) {
    return { width: 100, height: 63 };
  }

  if (is(semantic, 'dmn:BusinessKnowledgeModel')) {
    return { width: 135, height: 46 };
  }

  return { width: 100, height: 80 };
};
