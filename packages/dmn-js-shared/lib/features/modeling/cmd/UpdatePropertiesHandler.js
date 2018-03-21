import {
  isObject,
  isDefined,
  reduce
} from 'min-dash';

import {
  getBusinessObject
} from '../../../util/ModelUtil';

const ID = 'id';


/**
 * A generic handler that implements property editing.
 */
export default class EditPropertiesHandler {

  constructor(moddle) {
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

    if (isIdChange(bo, newProps)) {
      ids.unclaim(bo[ID]);

      ids.claim(newProps[ID], bo);
    }

    // Reduce over all new properties and return
    //
    // {
    //  changed,
    //  oldProperties
    // }
    return reduce(newProps, (result, value, key) => {

      const propertyValue = bo.get(key);

      // handle nested update
      if (isContainer(value)) {

        if (!isContainer(propertyValue)) {
          throw new Error(
            `non-existing property <${key}>: cannot update values`
          );
        }

        let {
          changed,
          oldProperties
        } = this.updateProperties(propertyValue, value);

        return {
          changed: [
            ...result.changed,
            ...changed,
            propertyValue
          ],
          oldProperties: {
            ...result.oldProperties,
            [key]: oldProperties
          }
        };
      }

      // handle plain update
      bo.set(key, value);

      return {
        changed: result.changed,
        oldProperties: {
          ...result.oldProperties,
          [key]: propertyValue
        }
      };

    }, { changed: [], oldProperties: { } });
  }

}

EditPropertiesHandler.$inject = [ 'moddle' ];

// helpers //////////////////////

function isIdChange(properties, element) {
  return ID in properties && properties[ID] !== element[ID];
}


function isContainer(o) {
  return (
    isDefined(o) &&
    isObject(o)
  );
}