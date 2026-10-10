import { find } from 'min-dash';

import { getBoxedExpression, is, isFeel } from 'dmn-js-shared/lib/util/ModelUtil';

/**
 * Return the literal expression of the displayed decision, if any.
 *
 * @param {Viewer} viewer
 *
 * @return {ModdleElement|undefined}
 */
export function getDecisionLiteralExpression(viewer) {
  const rootElement = viewer.getRootElement();

  if (!is(rootElement, 'dmn:Decision')) {
    return;
  }

  const expression = getBoxedExpression(rootElement);

  return is(expression, 'dmn:LiteralExpression') ? expression : undefined;
}

/**
 * Return the expression language of a literal expression, falling back
 * to the configured default. Like the choice of the editor, it is inherited
 * from the closest ancestor which specifies one.
 *
 * @param {ModdleElement} literalExpression
 * @param {ExpressionLanguages} expressionLanguages
 *
 * @return {string}
 */
export function getExpressionLanguage(literalExpression, expressionLanguages) {
  const expressionLanguage = getDeclaredExpressionLanguage(literalExpression);

  if (!expressionLanguage) {
    return expressionLanguages.getDefault().value;
  }

  const options = expressionLanguages.getAll();

  // languages are compared case-insensitively; FEEL may also be
  // referred to by its namespace
  const option = find(options, ({ value }) => (
    value.toLowerCase() === expressionLanguage.toLowerCase()
  )) || (isFeel(literalExpression) && find(options, ({ value }) => /feel/i.test(value)));

  return option ? option.value : expressionLanguage.toLowerCase();
}

function getDeclaredExpressionLanguage(element) {
  for (let current = element; current; current = current.$parent) {
    const expressionLanguage = current.get('expressionLanguage');

    if (expressionLanguage) {
      return expressionLanguage;
    }
  }
}

/**
 * The expression language is only of interest if there is a choice or the
 * literal expression does not use the default.
 *
 * @param {ModdleElement} literalExpression
 * @param {ExpressionLanguages} expressionLanguages
 *
 * @return {boolean}
 */
export function shouldDisplayExpressionLanguage(literalExpression, expressionLanguages) {
  if (expressionLanguages.getAll().length > 1) {
    return true;
  }

  return getExpressionLanguage(literalExpression, expressionLanguages) !==
    expressionLanguages.getDefault().value;
}
