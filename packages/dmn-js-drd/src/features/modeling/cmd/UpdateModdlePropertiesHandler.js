import {
  reduce,
  keys,
  forEach
} from 'min-dash';

export default function UpdateModdlePropertiesHandler(elementRegistry) {
  this._elementRegistry = elementRegistry;
}

UpdateModdlePropertiesHandler.$inject = [ 'elementRegistry' ];

UpdateModdlePropertiesHandler.prototype.execute = function(context) {

  var element = context.element,
      moddleElement = context.moddleElement,
      properties = context.properties;

  if (!moddleElement) {
    throw new Error('<moddleElement> required');
  }

  // TODO(nikku): we need to ensure that ID properties
  // are properly registered / unregistered via
  // this._moddle.ids.assigned(id)
  var changed = context.changed || [ element ];
  var oldProperties = context.oldProperties
    || getModdleProperties(moddleElement, keys(properties));

  setModdleProperties(moddleElement, properties);

  context.oldProperties = oldProperties;
  context.changed = changed;

  return changed;
};

UpdateModdlePropertiesHandler.prototype.revert = function(context) {
  var oldProperties = context.oldProperties,
      moddleElement = context.moddleElement,
      changed = context.changed;

  setModdleProperties(moddleElement, oldProperties);

  return changed;
};


// helpers /////////////////

function getModdleProperties(moddleElement, propertyNames) {
  return reduce(propertyNames, function(result, key) {
    result[key] = moddleElement.get(key);
    return result;
  }, {});
}

function setModdleProperties(moddleElement, properties) {
  forEach(properties, function(value, key) {
    moddleElement.set(key, value);
  });
}