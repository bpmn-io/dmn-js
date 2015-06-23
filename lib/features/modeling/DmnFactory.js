'use strict';

function DmnFactory(moddle) {
  this._model = moddle;
}

DmnFactory.$inject = [ 'moddle' ];


DmnFactory.prototype._needsId = function(element) {
  return element.$instanceOf('dmn:DMNElement');
};

DmnFactory.prototype._ensureId = function(element) {

  // generate semantic ids for elements
  // bpmn:SequenceFlow -> SequenceFlow_ID
  var prefix = (element.$type || '').replace(/^[^:]*:/g, '') + '_';

  if (!element.id && this._needsId(element)) {
    element.id = this._model.ids.nextPrefixed(prefix, element);
  }
};


DmnFactory.prototype.create = function(type, attrs) {
  var element = this._model.create(type, attrs || {});

  this._ensureId(element);

  return element;
};

DmnFactory.prototype.createRule = function(type, attrs) {
  attrs = attrs || {};
  attrs.condition = attrs.condition || [];
  attrs.conclusion = attrs.conclusion || [];

  var element = this.create(type, attrs);

  console.log('created rule', element);

  return element;
};

module.exports = DmnFactory;
