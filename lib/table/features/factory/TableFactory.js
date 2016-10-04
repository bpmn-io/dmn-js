'use strict';

function TableFactory(moddle) {
  this._model = moddle;
}

TableFactory.$inject = [ 'moddle' ];


TableFactory.prototype._needsId = function(element) {
  return element.$instanceOf('dmn:DMNElement');
};

TableFactory.prototype._ensureId = function(element) {

  // generate semantic ids for elements
  // bpmn:SequenceFlow -> SequenceFlow_ID
  var prefix = (element.$type || '').replace(/^[^:]*:/g, '') + '_';

  if (!element.id && this._needsId(element)) {
    element.id = this._model.ids.nextPrefixed(prefix, element);
  }
};


TableFactory.prototype.create = function(type, attrs) {
  var element = this._model.create(type, attrs || {});

  this._ensureId(element);

  return element;
};

TableFactory.prototype.createRule = function(id) {
  var attrs = { id: id };
  attrs.inputEntry = attrs.inputEntry || [];
  attrs.outputEntry = attrs.outputEntry || [];

  var element = this.create('dmn:DecisionRule', attrs);

  return element;
};

TableFactory.prototype.createInputEntry = function(text, clause, rule) {
  var element = this.create('dmn:UnaryTests', {
    text: text
  });

  var clauseIdx = clause.$parent.input.indexOf(clause);

  element.$parent = rule;

  if (!rule.inputEntry) {
    rule.inputEntry = [];
  }

  rule.inputEntry.splice(clauseIdx, 0, element);

  return element;
};

TableFactory.prototype.createInputClause = function(name) {
  var element = this.create('dmn:InputClause', {
    label: name
  });

  element.inputExpression = this.create('dmn:LiteralExpression', {});

  element.inputExpression.typeRef = 'string';

  element.inputExpression.$parent = element;

  return element;
};

TableFactory.prototype.createOutputClause = function(name) {
  var element = this.create('dmn:OutputClause', {
    label: name
  });

  element.typeRef = 'string';

  return element;
};

TableFactory.prototype.createOutputEntry = function(text, clause, rule) {
  var element = this.create('dmn:LiteralExpression', {
    text: text
  });

  var clauseIdx = clause.$parent.output.indexOf(clause);

  element.$parent = rule;

  if (!rule.outputEntry) {
    rule.outputEntry = [];
  }

  rule.outputEntry.splice(clauseIdx, 0, element);

  return element;
};

TableFactory.prototype.createInputValues = function(input) {
  var element = this.create('dmn:UnaryTests', {
    text: ''
  });

  input.inputValues = element;
  element.$parent = input;

  return element;
};

TableFactory.prototype.createOutputValues = function(output) {
  var element = this.create('dmn:UnaryTests', {
    text: ''
  });

  output.outputValues = element;
  element.$parent = output;

  return element;
};

module.exports = TableFactory;
