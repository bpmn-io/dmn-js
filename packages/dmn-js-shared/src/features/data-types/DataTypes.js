/**
 * Provide data types via config, or via registered providers.
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
 *
 * @example
 *
 * // Register a provider that adds or alters the collected data types.
 * // The higher the priority, the earlier the provider is called. Register
 * // below the default priority (1000) to receive the configured data types.
 * // Data types may be grouped; group names are shown if there are multiple
 * // groups.
 * dataTypes.registerProvider(500, {
 *   getDataTypes(dataTypes) {
 *     return [
 *       ...dataTypes,
 *       { name: 'myCustomType', group: { id: 'custom', name: 'Custom' } }
 *     ];
 *   }
 * });
 *
 * @typedef {Object} DataTypeGroup
 * @property {string} id
 * @property {string} [name] header to display, shown if there are multiple groups
 *
 * @typedef {Object} DataType
 * @property {string} name value persisted as `typeRef`, identifies the data type
 * @property {string} label text to display
 * @property {DataTypeGroup} [group]
 *
 * @typedef {Object} DataTypeDefinition
 * @property {string} name
 * @property {string} [label] defaults to `name`
 * @property {string | DataTypeGroup} [group] group, or its id
 */
export default class DataTypes {

  /**
   * @param {import('diagram-js/lib/core/EventBus').default} eventBus
   */
  constructor(eventBus) {
    this._eventBus = eventBus;
  }

  /**
   * Register a data types provider.
   *
   * @param {number} [priority]
   * @param {Object} provider
   * @param {(dataTypes: DataType[]) => (DataType | DataTypeDefinition)[]} provider.getDataTypes
   */
  registerProvider(priority, provider) {
    if (!provider) {
      provider = priority;
      priority = null;
    }

    const callback = function(event) {
      event.providers.push(provider);
    };

    if (priority === null) {
      this._eventBus.on('dataTypes.getProviders', callback);
    } else {
      this._eventBus.on('dataTypes.getProviders', priority, callback);
    }
  }

  /**
   * Get list of data types, as collected from all registered providers.
   *
   * Data types are normalized (`label` defaults to `name`, a string `group`
   * becomes `{ id }`) and identified by their name. If a data type is
   * provided more than once, the last one wins but keeps the position of the
   * first one, i.e. later providers override earlier ones (same as in popup
   * menu).
   *
   * Labels and group names are not translated here; providers are
   * responsible for providing translated texts.
   *
   * @returns {DataType[]}
   */
  getAll() {
    const event = this._eventBus.createEvent({
      type: 'dataTypes.getProviders',
      providers: []
    });

    this._eventBus.fire(event);

    let dataTypes = [];

    for (const provider of event.providers) {
      dataTypes = normalize(provider.getDataTypes(dataTypes));
    }

    return dataTypes;
  }
}

DataTypes.$inject = [ 'eventBus' ];


// helper ////

function normalize(dataTypes) {
  const byName = new Map();

  dataTypes.forEach(({ name, label, group }) => {
    const dataType = { name, label: label || name };

    if (group) {
      dataType.group = typeof group === 'string' ? { id: group } : group;
    }

    byName.set(name, dataType);
  });

  return [ ...byName.values() ];
}
