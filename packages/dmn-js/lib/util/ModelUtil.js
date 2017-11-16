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
  element = getBusinessObject(element);

  var name = element.name;

  return name;
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
