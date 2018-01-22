'use strict';

var any = require('lodash/collection/any');

/**
 * Is an element of the given DMN type?
 *
 * @param  {tjs.model.Base|ModdleElement} element
 * @param  {String} type
 *
 * @return {Boolean}
 */
function is(element, type) {
  var bo = getBusinessObject(element);

  return bo && (typeof bo.$instanceOf === 'function') && bo.$instanceOf(type);
}

module.exports.is = is;


function isInput(element) {
  return is(element, 'dmn:InputClause');
}

module.exports.isInput = isInput;


function isOutput(element) {
  return is(element, 'dmn:OutputClause');
}

module.exports.isOutput = isOutput;


/**
 * Return the business object for a given element.
 *
 * @param  {tjs.model.Base|ModdleElement} element
 *
 * @return {ModdleElement}
 */
function getBusinessObject(element) {
  return (element && element.businessObject) || element;
}

module.exports.getBusinessObject = getBusinessObject;


function getName(element) {
  return getBusinessObject(element).name;
}

module.exports.getName = getName;


/**
 * Return true if element has any of the given types.
 *
 * @param {djs.model.Base} element
 * @param {Array<String>} types
 *
 * @return {Boolean}
 */
function isAny(element, types) {
  return any(types, function(t) {
    return is(element, t);
  });
}

module.exports.isAny = isAny;
