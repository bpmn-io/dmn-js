import Manager from './Manager';

import Ids from 'ids';

import { isAny } from '../util/ModelUtil';


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

        var viewsChanged = elements.some(function(e) {
          return isAny(e, [ 'dmn:Decision', 'dmn:Definitions' ]);
        });

        if (viewsChanged) {
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
    // and validated ids in the DMN XML document
    // tree
    moddle.ids = new Ids([ 32, 36, 1 ]);

    return moddle;
  }

}