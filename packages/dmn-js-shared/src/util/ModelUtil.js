import { some } from 'min-dash';

/**
 * Is an element of the given DMN type?
 *
 * @param  {tjs.model.Base|ModdleElement} element
 * @param  {string} type
 *
 * @return {boolean}
 */
export function is(element, type) {
  var bo = getBusinessObject(element);

  return bo && (typeof bo.$instanceOf === 'function') && bo.$instanceOf(type);
}


export function isInput(element) {
  return is(element, 'dmn:InputClause');
}


export function isOutput(element) {
  return is(element, 'dmn:OutputClause');
}


export function isRule(element) {
  return is(element, 'dmn:DecisionRule');
}


/**
 * Return the business object for a given element.
 *
 * @param  {tjs.model.Base|ModdleElement} element
 *
 * @return {ModdleElement}
 */
export function getBusinessObject(element) {
  return (element && element.businessObject) || element;
}


export function getName(element) {
  return getBusinessObject(element).name;
}


/**
 * Return true if element has any of the given types.
 *
 * @param {djs.model.Base} element
 * @param {Array<string>} types
 *
 * @return {boolean}
 */
export function isAny(element, types) {
  return some(types, function(t) {
    return is(element, t);
  });
}

/**
 * Return main boxed expression of a given decision or BKM.
 *
 * @param {ModdleElement} decisionOrBkm - the decision or business knowledge model
 * @returns {ModdleElement|undefined}
 */
export function getBoxedExpression(decisionOrBkm) {
  var bo = getBusinessObject(decisionOrBkm);

  if (is(bo, 'dmn:Decision')) {
    return bo.get('decisionLogic');
  } else if (is(bo, 'dmn:BusinessKnowledgeModel')) {
    var encapsulatedLogic = bo.get('encapsulatedLogic');

    return encapsulatedLogic && encapsulatedLogic.get('body');
  }
}

const FEEL_NAMESPACE = 'https://www.omg.org/spec/DMN/20191111/FEEL/';

/**
 * Return `true` if the expression language for a given element is FEEL.
 *
 * @param {ModdleElement} element
 * @returns {string}
 */
export function isFeel(element) {
  for (let current = element; current; current = current.$parent) {
    const expressionLanguage = current.get('expressionLanguage');

    if (expressionLanguage) {
      if (expressionLanguage === FEEL_NAMESPACE || /feel/i.test(expressionLanguage)) {
        return true;
      } else {
        return false;
      }
    }

    if (is(current, 'dmn:FunctionDefinition')) {

      // TODO(@barmac): remove fallback when moddle assures the default value
      const kind = current.get('kind') || 'FEEL';

      return kind === 'FEEL';
    }
  }

  return true;
}
