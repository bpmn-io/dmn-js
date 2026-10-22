/**
 * Provides the named item definitions of the current model as custom data
 * types, appended to the configured data types.
 *
 * The model is looked up via the viewer, if there is one. Registered with a
 * priority below the default (1000), i.e. called after the configured data
 * types were collected. Providers registered with a lower priority may alter
 * the combined list.
 */
export default class ModelDataTypesProvider {

  /**
   * @param {import('./DataTypes').default} dataTypes
   * @param {import('didi').Injector} injector
   * @param {import('diagram-js/lib/i18n/translate/Translate').default} translate
   */
  constructor(dataTypes, injector, translate) {
    this._injector = injector;
    this._translate = translate;

    dataTypes.registerProvider(500, this);
  }

  /**
   * @param {import('./DataTypes').DataType[]} dataTypes
   *
   * @return {import('./DataTypes').DataType[]}
   */
  getDataTypes(dataTypes) {
    const viewer = this._injector.get('viewer', false);

    const definitions = viewer && viewer.getDefinitions();

    if (!definitions) {
      return dataTypes;
    }

    const group = { id: 'custom', name: this._translate('Custom') };

    const known = new Set(dataTypes.map(({ name }) => name));

    const customTypes = [];

    for (const { name } of definitions.get('itemDefinition')) {
      if (name && !known.has(name)) {
        known.add(name);

        customTypes.push({ name, group });
      }
    }

    return [ ...dataTypes, ...customTypes ];
  }
}

ModelDataTypesProvider.$inject = [ 'dataTypes', 'injector', 'translate' ];
