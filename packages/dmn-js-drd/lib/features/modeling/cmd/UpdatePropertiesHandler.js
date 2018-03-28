import {
  reduce,
  keys,
  forEach
} from 'min-dash';

var NAME = 'name',
    ID = 'id';


/**
 * A handler that implements a DMN property update.
 *
 * This should be used to set simple properties on elements with
 * an underlying DMN business object.
 *
 * Use respective diagram-js provided handlers if you would
 * like to perform automated modeling.
 */
export default function UpdatePropertiesHandler(elementRegistry, moddle) {
  this._elementRegistry = elementRegistry;
  this._moddle = moddle;
}

UpdatePropertiesHandler.$inject = [ 'elementRegistry', 'moddle' ];


/**
 * Updates a DMN element with a list of new properties
 *
 * @param {Object} context
 * @param {djs.model.Base} context.element the element to update
 * @param {Object} context.properties a list of properties to set on the element's
 *                                    businessObject (the DMN model element)
 *
 * @return {Array<djs.model.Base>} the updated element
 */
UpdatePropertiesHandler.prototype.execute = function(context) {

  var element = context.element,
      changed = [ element];

  if (!element) {
    throw new Error('element required');
  }

  var elementRegistry = this._elementRegistry,
      ids = this._moddle.ids;

  var businessObject = element.businessObject,
      properties = context.properties,
      oldProperties = (
        context.oldProperties ||
        getProperties(businessObject, keys(properties))
      );

  if (isIdChange(properties, businessObject)) {
    ids.unclaim(businessObject[ID]);

    elementRegistry.updateId(element, properties[ID]);

    ids.claim(properties[ID], businessObject);
  }

  if (NAME in properties && element.label) {
    changed.push(element.label);
  }

  // update properties
  setProperties(businessObject, properties);

  // store old values
  context.oldProperties = oldProperties;
  context.changed = changed;

  // indicate changed on objects affected by the update
  return changed;
};


/**
 * Reverts the update on a DMN elements properties.
 *
 * @param  {Object} context
 *
 * @return {djs.model.Base} the updated element
 */
UpdatePropertiesHandler.prototype.revert = function(context) {

  var element = context.element,
      properties = context.properties,
      oldProperties = context.oldProperties,
      businessObject = element.businessObject,
      elementRegistry = this._elementRegistry,
      ids = this._moddle.ids;

  // update properties
  setProperties(businessObject, oldProperties);

  if (isIdChange(properties, businessObject)) {
    ids.unclaim(properties[ID]);

    elementRegistry.updateId(element, oldProperties[ID]);

    ids.claim(oldProperties[ID], businessObject);
  }

  return context.changed;
};


function isIdChange(properties, businessObject) {
  return ID in properties && properties[ID] !== businessObject[ID];
}


function getProperties(businessObject, propertyNames) {
  return reduce(propertyNames, function(result, key) {
    result[key] = businessObject.get(key);
    return result;
  }, {});
}


function setProperties(businessObject, properties) {
  forEach(properties, function(value, key) {
    businessObject.set(key, value);
  });
}
