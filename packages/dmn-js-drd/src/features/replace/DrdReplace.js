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
      newBusinessObject.decisionLogic = table;
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
    }

    if (target.expression) {
      newBusinessObject.decisionLogic = drdFactory.create('dmn:LiteralExpression');
      newBusinessObject.variable = drdFactory.create('dmn:InformationItem');
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
