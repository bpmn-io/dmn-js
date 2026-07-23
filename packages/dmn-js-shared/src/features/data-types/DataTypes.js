const DEFAULT_DATA_TYPES = [
  'string',
  'boolean',
  'number',
  'date',
  'time',
  'date and time',
  'days and time duration',
  'years and months duration',
  'Any'
];

const TYPE_ALIASES = {
  dateTime: 'date and time',
  dayTimeDuration: 'days and time duration',
  yearMonthDuration: 'years and months duration'
};

export function normalizeTypeRef(typeRef) {
  return TYPE_ALIASES[typeRef] || typeRef;
}

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
    this._dataTypes = (configuredDataTypes || DEFAULT_DATA_TYPES)
      .map(typeRef => normalizeTypeRef(typeRef));
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
    return normalizeTypeRef(typeRef);
  }
}

DataTypes.$inject = [ 'config.dataTypes' ];
