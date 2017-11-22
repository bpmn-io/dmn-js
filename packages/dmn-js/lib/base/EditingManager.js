import Manager from './Manager';

import Ids from 'ids';


export default class EditingManager extends Manager {

  _init(options) {

    super._init(options);

    // hook ID collection into the modeler
    this.on('import.parse.complete', (event) => {
      if (!event.error) {
        this._collectIds(event.definitions, event.context);
      }
    });

    this.on('destroy', () => {
      this._moddle.ids.clear();
    });

    this.on('viewer.created', ({ viewer }) => {

      viewer.on('elements.changed', ({ elements }) => {

        if (elements.some(function(e) {

          var bo = e.businessObject;

          return bo && (
            bo.$instanceOf('dmn:Decision') ||
            bo.$instanceOf('dmn:Definitions')
          );
        })) {

          this._updateViews();
        }
      });
    });
  }

  /**
   * Collect ids processed during parsing of the
   * definitions object.
   *
   * @param {ModdleElement} definitions
   * @param {Context} context
   */
  _collectIds(definitions, context) {

    var moddle = definitions.$model,
        ids = moddle.ids,
        id;

    // remove references from previous import
    ids.clear();

    for (id in context.elementsById) {
      ids.claim(id, context.elementsById[id]);
    }
  }

  _createModdle(options) {
    var moddle = super._createModdle(options);

    // attach ids to moddle to be able to track
    // and validated ids in the DMN 1.1 XML document
    // tree
    moddle.ids = new Ids([ 32, 36, 1 ]);

    return moddle;
  }

}