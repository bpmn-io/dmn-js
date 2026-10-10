import { is } from 'dmn-js-shared/lib/util/ModelUtil';

/**
 * This module takes care of replacing DRD elements
 */
export default function DrdReplace(drdFactory, replace, selection, modeling) {

  /**
   * Prepares a new business object for the replacement element
   * and triggers the replace operation.
   *
   * @param  {djs.model.Base} element
   * @param  {Object} target
   * @param  {Object} [hints]
   *
   * @return {djs.model.Base} the newly created element
   */
  function replaceElement(element, target, hints) {

    hints = hints || {};

    var type = target.type,
        oldBusinessObject = element.businessObject;

    var newBusinessObject = drdFactory.create(type);

    var newElement = {
      type: type,
      businessObject: newBusinessObject
    };

    newElement.width = element.width;
    newElement.height = element.height;

    newBusinessObject.name = oldBusinessObject.name;

    // keep the existing variable (and its type ref) across the morph
    var variable = oldBusinessObject.variable;

    if (variable) {
      newBusinessObject.variable = variable;
      variable.$parent = newBusinessObject;
    }

    if (target.table) {
      var table = drdFactory.create('dmn:DecisionTable');
      table.$parent = newBusinessObject;

      var output = drdFactory.create('dmn:OutputClause');
      output.typeRef = 'string';
      output.$parent = table;
      table.output = [ output ];

      var input = drdFactory.create('dmn:InputClause');
      input.$parent = table;

      var inputExpression = drdFactory.create('dmn:LiteralExpression', {
        typeRef: 'string'
      });

      input.inputExpression = inputExpression;
      inputExpression.$parent = input;

      table.input = [ input ];

      setBoxedExpression(newBusinessObject, table, drdFactory, oldBusinessObject);
    }

    if (target.expression) {
      var literalExpression = drdFactory.create('dmn:LiteralExpression');

      setBoxedExpression(
        newBusinessObject, literalExpression, drdFactory, oldBusinessObject
      );
    }

    return replace.replaceElement(element, newElement, hints);
  }

  this.replaceElement = replaceElement;
}

DrdReplace.$inject = [
  'drdFactory',
  'replace',
  'selection',
  'modeling'
];

// helper //////////////////////////////////////////////////////////////
function setBoxedExpression(bo, expression, drdFactory, oldBo) {
  if (is(bo, 'dmn:Decision')) {
    bo.decisionLogic = expression;
    expression.$parent = bo;
  } else if (is(bo, 'dmn:BusinessKnowledgeModel')) {
    var encapsulatedLogic = drdFactory.create('dmn:FunctionDefinition', {
      body: expression });

    // keep the signature of the function, the implementation is replaced
    var formalParameters = copyFormalParameters(oldBo, drdFactory);

    if (formalParameters.length) {
      encapsulatedLogic.formalParameter = formalParameters;

      formalParameters.forEach(function(parameter) {
        parameter.$parent = encapsulatedLogic;
      });
    }

    bo.encapsulatedLogic = encapsulatedLogic;
    encapsulatedLogic.$parent = bo;
    expression.$parent = encapsulatedLogic;
  }
}

/**
 * Copy the formal parameters of a business knowledge model, so that
 * the replaced one stays intact, e.g. when undoing the replacement.
 */
function copyFormalParameters(bo, drdFactory) {
  var encapsulatedLogic = bo.encapsulatedLogic;

  if (!encapsulatedLogic) {
    return [];
  }

  return (encapsulatedLogic.formalParameter || []).map(function(parameter) {
    var attrs = {};

    [ 'name', 'typeRef', 'label', 'description' ].forEach(function(name) {
      if (parameter[name] !== undefined) {
        attrs[name] = parameter[name];
      }
    });

    return drdFactory.create('dmn:InformationItem', attrs);
  });
}