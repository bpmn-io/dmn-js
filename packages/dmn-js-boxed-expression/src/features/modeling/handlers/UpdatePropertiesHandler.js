import {
  getBusinessObject
} from 'dmn-js-shared/lib/util/ModelUtil';

const ID = 'id';


/**
 * A generic handler that implements property editing.
 */
export default class EditPropertiesHandler {

  constructor(elementRegistry, moddle) {
    this._elementRegistry = elementRegistry;
    this._moddle = moddle;
  }

  /**
   * <do>
   */
  execute(context) {

    const {
      element,
      properties
    } = context;

    const bo = getBusinessObject(element);

    const {
      changed,
      oldProperties
    } = this.updateProperties(bo, properties);

    context.oldProperties = oldProperties;

    return [
      ...changed,
      element
    ];
  }

  /**
   * <undo>
   */
  revert(context) {
    const {
      element,
      oldProperties
    } = context;

    var bo = getBusinessObject(element);

    var {
      changed
    } = this.updateProperties(bo, oldProperties);

    return [
      ...changed,
      element
    ];
  }


  /**
   * Update properties of the given business object
   * and return { changed, oldProperties }.
   */
  updateProperties(bo, newProps) {

    const ids = this._moddle.ids;

    // Reduce over all new properties and return
    //
    // {
    //  changed,
    //  oldProperties
    // }
    const result = {
      changed: [ bo ],
      oldProperties: {}
    };

    for (const key in newProps) {
      const value = newProps[key];

      const oldValue = bo.get(key);

      // handle ID change
      if (key === ID && isIdChange(bo, value)) {
        ids.unclaim(bo[ID]);

        this._elementRegistry.updateId(bo, value);

        ids.claim(value, bo);
      }

      // handle plain update
      bo.set(key, value);

      result.oldProperties = {
        ...result.oldProperties,
        [key]: oldValue
      };
    }

    return result;
  }

}

EditPropertiesHandler.$inject = [ 'elementRegistry', 'moddle' ];

// helpers //////////////////////

function isIdChange(element, newId) {
  return element[ID] !== newId;
}
