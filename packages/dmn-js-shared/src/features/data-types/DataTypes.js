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
 * dataTypes.registerProvider(500, {
 *   getDataTypes(dataTypes) {
 *     return [ ...dataTypes, 'myCustomType' ];
 *   }
 * });
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
   * @param {(dataTypes: string[]) => string[]} provider.getDataTypes
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
   * @returns {string[]}
   */
  getAll() {
    const event = this._eventBus.createEvent({
      type: 'dataTypes.getProviders',
      providers: []
    });

    this._eventBus.fire(event);

    return event.providers
      .reduce((dataTypes, provider) => provider.getDataTypes(dataTypes), []);
  }
}

DataTypes.$inject = [ 'eventBus' ];
