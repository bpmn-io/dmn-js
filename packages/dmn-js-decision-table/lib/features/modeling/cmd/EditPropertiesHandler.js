import forEach from 'lodash/forEach';

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
    const ids = this._moddle.ids;

    const {
      element,
      properties
    } = context;

    if (isIdChange(properties, element)) {
      ids.unclaim(element[ID]);

      ids.claim(properties[ID], element);
    }

    const oldProperties = {};

    forEach(properties, (value, key) => {
      oldProperties[key] = element[key];

      element[key] = value;
    });

    context.oldProperties = oldProperties;

    return element;
  }


  /**
   * <undo>
   */
  revert(context) {
    const {
      element,
      oldProperties
    } = context;

    forEach(oldProperties, (value, key) => {
      element[key] = value;
    });

    return element;
  }

}

EditPropertiesHandler.$inject = [ 'moddle' ];

////////// helpers //////////

function isIdChange(properties, element) {
  return ID in properties && properties[ID] !== element[ID];
}