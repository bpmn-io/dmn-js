import forEach from 'lodash/forEach';

/**
 * A generic handler that implements property editing.
 */
export default class EditPropertiesHandler {

  /**
   * <do>
   */
  execute(context) {
    const {
      element,
      properties
    } = context;

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