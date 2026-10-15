import { getBusinessObject, is } from '../../util/ModelUtil';

/**
 * Append named item definitions from the current model after configured types.
 * Providers below priority 500 may alter the combined list.
 */
export default class ModelDataTypesProvider {

  constructor(dataTypes) {
    dataTypes.registerProvider(500, this);
  }

  /**
   * @param {string[]} dataTypes
   * @param {tjs.model.Base|ModdleElement} [element]
   * @returns {string[]}
   */
  getDataTypes(dataTypes, element) {
    let definitions = getBusinessObject(element);

    while (definitions && !is(definitions, 'dmn:Definitions')) {
      definitions = definitions.$parent;
    }

    if (!definitions) {
      return dataTypes;
    }

    const names = definitions.get('itemDefinition')
      .map(definition => definition.name)
      .filter(Boolean);

    return [ ...new Set([ ...dataTypes, ...names ]) ];
  }
}

ModelDataTypesProvider.$inject = [ 'dataTypes' ];
