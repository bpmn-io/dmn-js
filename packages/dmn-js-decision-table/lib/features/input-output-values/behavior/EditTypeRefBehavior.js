import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

/**
 * Makes sure allowed values are removed if type is set to something other than string.
 */
export default class EditTypeRefBehavior extends CommandInterceptor {
  constructor(eventBus, modeling) {
    super(eventBus);

    this.postExecuted('editProperties', event => {
      const { element, properties } = event.context;

      if (properties.typeRef && properties.typeRef !== 'string') {

        // delete allowed values
        if (is(element, 'dmn:LiteralExpression')) {
          modeling.editAllowedValues(element.$parent, null);
        } else {
          modeling.editAllowedValues(element, null);
        }
      }
    });
  }
}

EditTypeRefBehavior.$inject = [ 'eventBus', 'modeling' ];