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
   * Get list of configured data types.
   *
   * @returns {string[]}
   */
  getAll() {
    return this._dataTypes;
  }
}

DataTypes.$inject = [ 'config.dataTypes' ];
