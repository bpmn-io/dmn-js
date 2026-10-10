import { getBoxedExpression, is } from 'dmn-js-shared/lib/util/ModelUtil';

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
 * to the configured default.
 *
 * @param {ModdleElement} literalExpression
 * @param {ExpressionLanguages} expressionLanguages
 *
 * @return {string}
 */
export function getExpressionLanguage(literalExpression, expressionLanguages) {
  const { expressionLanguage } = literalExpression;

  return expressionLanguage
    ? expressionLanguage.toLowerCase()
    : expressionLanguages.getDefault().value;
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
