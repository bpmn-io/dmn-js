import { getBoxedExpression, is } from 'dmn-js-shared/lib/util/ModelUtil';

export function elementToString(element) {
  if (!element) {
    return '<null>';
  }

  const id = element.id ? ` id="${element.id}"` : '';

  return `<${element.$type}${id} />`;
}

/**
 * Return the decision table of a decision or business knowledge model.
 *
 * Function definitions are unwrapped to their body, mirroring how the
 * expression is rendered.
 *
 * @param {ModdleElement} element
 *
 * @return {ModdleElement|undefined}
 */
export function getDecisionTable(element) {
  let expression = getBoxedExpression(element);

  while (is(expression, 'dmn:FunctionDefinition')) {
    expression = expression.get('body');
  }

  return is(expression, 'dmn:DecisionTable') ? expression : undefined;
}
