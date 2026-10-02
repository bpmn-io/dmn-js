import { getBusinessObject, is } from '../../util/ModelUtil';

const DEFAULT_DATA_TYPES = [
  'string',
  'boolean',
  'number',
  'date',
  'time',
  'dateTime',
  'dayTimeDuration',
  'yearMonthDuration',
  'Any'
];

/**
 * Provide data types via config.
 *
 * @example
 *
 * // The data types will include multiple number types: integer, long, and double.
 * const editor = new DmnJS({
 *   common: {
 *     dataTypes: [
 *       'string',
 *       'boolean',
 *       'integer',
 *       'long',
 *       'double',
 *       'date'
 *     ]
 *   }
 * })
 */
export default class DataTypes {

  /**
   * @param {string[]} configuredDataTypes
   */
  constructor(configuredDataTypes) {
    this._dataTypes = configuredDataTypes || DEFAULT_DATA_TYPES;
  }

  /**
   * Get configured data types and named item definitions from the given model.
   *
   * @param {tjs.model.Base|ModdleElement} [element] - An element in the current diagram.
   *
   * @returns {string[]}
   */
  getAll(element) {
    const definitions = getDefinitions(element);

    if (!definitions) {
      return this._dataTypes;
    }

    const customTypes = definitions.get('itemDefinition')
      .map(itemDefinition => itemDefinition.name)
      .filter(Boolean);

    return [ ...new Set([ ...this._dataTypes, ...customTypes ]) ];
  }
}

DataTypes.$inject = [ 'config.dataTypes' ];


// helpers //////////

function getDefinitions(element) {
  element = getBusinessObject(element);

  while (element && !is(element, 'dmn:Definitions')) {
    element = element.$parent;
  }

  return element;
}
