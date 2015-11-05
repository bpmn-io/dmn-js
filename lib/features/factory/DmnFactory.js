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

DmnFactory.prototype.createRule = function(id) {
  var attrs = {id: id};
  attrs.inputEntry = attrs.inputEntry || [];
  attrs.outputEntry = attrs.outputEntry || [];

  var element = this.create('dmn:DecisionRule', attrs);

  return element;
};

DmnFactory.prototype.createInputEntry = function(text, clause, rule) {
  var element = this.create('dmn:UnaryTests', {
    text: text
  });

  var clauseIdx = clause.$parent.input.indexOf(clause);

  element.$parent = rule;
  rule.inputEntry.splice(clauseIdx, 0, element);

  return element;
};

DmnFactory.prototype.createInputClause = function(name) {
  var element = this.create('dmn:InputClause', {
    label: name
  });
  element.inputExpression = this.create('dmn:LiteralExpression', {});

  element.inputExpression.typeRef = 'string';

  return element;
};

DmnFactory.prototype.createOutputClause = function(name) {
  var element = this.create('dmn:OutputClause', {
    label: name
  });

  element.typeRef = 'string';

  return element;
};

DmnFactory.prototype.createOutputEntry = function(text, clause, rule) {
  var element = this.create('dmn:LiteralExpression', {
    text: text
  });

  var clauseIdx = clause.$parent.output.indexOf(clause);

  element.$parent = rule;
  rule.outputEntry.splice(clauseIdx, 0, element);

  return element;
};

module.exports = DmnFactory;
