import { getBoxedExpression, is } from 'dmn-js-shared/lib/util/ModelUtil';

export function elementToString(element) {
  if (!element) {
    return '<null>';
  }

  const id = element.id ? ` id="${element.id}"` : '';

  return `<${element.$type}${id} />`;
}

/**
 * Return the decision tables of a decision or business knowledge model, in
 * document order.
 *
 * Function definitions are unwrapped to their body and contexts to the values
 * of their entries, mirroring how the expression is rendered.
 *
 * @param {ModdleElement} element
 *
 * @return {ModdleElement[]}
 */
export function getDecisionTables(element) {
  return collectDecisionTables(getBoxedExpression(element));
}

function collectDecisionTables(expression) {
  if (is(expression, 'dmn:DecisionTable')) {
    return [ expression ];
  }

  if (is(expression, 'dmn:FunctionDefinition')) {
    return collectDecisionTables(expression.get('body'));
  }

  if (is(expression, 'dmn:Context')) {
    return expression.get('contextEntry').flatMap(entry => {
      return collectDecisionTables(entry.get('value'));
    });
  }

  return [];
}
