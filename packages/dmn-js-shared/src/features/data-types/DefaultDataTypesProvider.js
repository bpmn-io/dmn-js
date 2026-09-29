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
 * Provides the configured, or default, data types.
 *
 * Registered with the default priority (1000). Providers registered with a
 * lower priority are called later and may add to, or alter, the configured
 * data types. Providers registered with a higher priority are called earlier
 * and may only prepend data types.
 */
export default class DefaultDataTypesProvider {

  /**
   * @param {string[]} configuredDataTypes
   * @param {import('./DataTypes').default} dataTypes
   */
  constructor(configuredDataTypes, dataTypes) {
    this._configuredDataTypes = configuredDataTypes || DEFAULT_DATA_TYPES;

    dataTypes.registerProvider(this);
  }

  getDataTypes(dataTypes) {
    return [ ...dataTypes, ...this._configuredDataTypes ];
  }
}

DefaultDataTypesProvider.$inject = [ 'config.dataTypes', 'dataTypes' ];
