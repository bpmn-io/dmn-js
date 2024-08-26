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

      setBoxedExpression(newBusinessObject, table, drdFactory);
    }

    if (target.expression) {

      // variable set to element name
      var literalExpression = drdFactory.create('dmn:LiteralExpression'),
          variable = drdFactory.create('dmn:InformationItem',
            { name: oldBusinessObject.name });

      setBoxedExpression(newBusinessObject, literalExpression, drdFactory, variable);
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
function setBoxedExpression(bo, expression, drdFactory, variable) {
  if (is(bo, 'dmn:Decision')) {
    bo.decisionLogic = expression;
    expression.$parent = bo;
  } else if (is(bo, 'dmn:BusinessKnowledgeModel')) {
    var encapsulatedLogic = drdFactory.create('dmn:FunctionDefinition', {
      body: expression });

    bo.encapsulatedLogic = encapsulatedLogic;
    encapsulatedLogic.$parent = bo;
    expression.$parent = encapsulatedLogic;
  }

  if (variable) {
    bo.variable = variable;
    variable.$parent = bo;
  }
}