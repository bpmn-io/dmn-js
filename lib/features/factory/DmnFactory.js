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

DmnFactory.prototype.createRule = function(type, id) {
  var attrs = {id: id};
  attrs.condition = attrs.condition || [];
  attrs.conclusion = attrs.conclusion || [];

  var element = this.create(type, attrs);

  return element;
};

DmnFactory.prototype.createInputEntry = function(text, clause, rule) {
  var element = this.create('dmn:LiteralExpression', {
    text: text
  });
  element.$parent = clause;
  clause.inputEntry.push(element);
  rule.condition.push(element);

  return element;
};

DmnFactory.prototype.createInputClause = function(name) {
  var element = this.create('dmn:Clause', {
    name: name
  });
  element.inputEntry = [];
  element.inputExpression = this.create('dmn:LiteralExpression', {});
  element.inputExpression.itemDefinition = this.create('dmn:DMNElementReference', {});

  return element;
};

DmnFactory.prototype.createOutputClause = function(name) {
  var element = this.create('dmn:Clause', {
    name: name
  });
  element.outputEntry = [];
  element.outputDefinition = this.create('dmn:DMNElementReference', {});

  return element;
};

DmnFactory.prototype.createOutputEntry = function(text, clause, rule) {
  var element = this.create('dmn:LiteralExpression', {
    text: text
  });
  element.$parent = clause;
  clause.outputEntry.push(element);
  rule.conclusion.push(element);

  return element;
};

DmnFactory.prototype.createItemDefinition = function() {
  var element = this.create('dmn:ItemDefinition', {
    typeDefinition: 'string'
  });

  return element;
};

DmnFactory.prototype.createAllowedValue = function(text, itemDefinition) {
  var element = this.create('dmn:LiteralExpression', {
    text: text
  });
  element.$parent = itemDefinition;
  itemDefinition.allowedValue = itemDefinition.allowedValue || [];
  itemDefinition.allowedValue.push(element);

  return element;
};

module.exports = DmnFactory;
