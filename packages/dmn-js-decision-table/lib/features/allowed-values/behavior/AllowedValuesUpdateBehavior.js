import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

/**
 * Makes sure allowed values are removed if type is set to
 * something other than string.
 */
export default class AllowedValuesUpdateBehavior extends CommandInterceptor {

  constructor(eventBus, modeling) {
    super(eventBus);

    this.postExecuted('updateProperties', event => {
      const {
        element,
        properties
      } = event.context;

      if (properties.typeRef && properties.typeRef !== 'string') {

        const target = (
          is(element, 'dmn:LiteralExpression') ?
            element.$parent :
            element
        );

        // delete allowed values
        modeling.editAllowedValues(target, null);
      }
    });
  }
}

AllowedValuesUpdateBehavior.$inject = [
  'eventBus',
  'modeling'
];