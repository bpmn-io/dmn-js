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
 * Default data types are grouped as built-ins. Configured data types may be
 * strings, or data type definitions. Their labels and group names are
 * translated.
 *
 * Registered with the default priority (1000). Providers registered with a
 * lower priority are called later and may add to, or alter, the configured
 * data types. Providers registered with a higher priority are called earlier
 * and may only prepend data types.
 */
export default class DefaultDataTypesProvider {

  /**
   * @param {(string | import('./DataTypes').DataTypeDefinition)[]} configuredDataTypes
   * @param {import('./DataTypes').default} dataTypes
   * @param {import('diagram-js/lib/i18n/translate/Translate').default} translate
   */
  constructor(configuredDataTypes, dataTypes, translate) {
    this._translate = translate;

    this._dataTypes = configuredDataTypes || DEFAULT_DATA_TYPES.map(name => ({
      name,
      group: { id: 'built-in', name: 'Built-ins' }
    }));

    dataTypes.registerProvider(this);
  }

  getDataTypes(dataTypes) {
    return [
      ...dataTypes,
      ...this._dataTypes.map(dataType => this._translateDataType(dataType))
    ];
  }

  _translateDataType(dataType) {
    const translate = this._translate;

    const { name, label = name, group } = typeof dataType === 'string'
      ? { name: dataType }
      : dataType;

    return {
      name,
      label: translate(label),
      group: group && (
        typeof group === 'string'
          ? group
          : { ...group, name: group.name && translate(group.name) }
      )
    };
  }
}

DefaultDataTypesProvider.$inject = [
  'config.dataTypes',
  'dataTypes',
  'translate'
];
