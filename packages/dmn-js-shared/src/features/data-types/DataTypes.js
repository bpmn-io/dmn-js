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

const TYPE_LABELS = {
  dateTime: 'date and time',
  dayTimeDuration: 'days and time duration',
  yearMonthDuration: 'years and months duration'
};

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

  /**
   * Get display label for a configured data type.
   *
   * @param {string} typeRef
   *
   * @returns {string}
   */
  getLabel(typeRef) {
    return TYPE_LABELS[typeRef] || typeRef;
  }
}

DataTypes.$inject = [ 'config.dataTypes' ];
