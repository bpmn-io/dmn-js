import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { is, isInput } from 'dmn-js-shared/lib/util/ModelUtil';

/**
 * Makes sure allowed values are removed if type is set to
 * something other than string.
 */
export default class AllowedValuesUpdateBehavior extends CommandInterceptor {

  constructor(eventBus, modeling) {
    super(eventBus);

    this.postExecuted('element.updateProperties', event => {
      const {
        element,
        properties
      } = event.context;

      const actualProperties = isInput(element) ? properties.inputExpression : properties;

      if (actualProperties
        && actualProperties.typeRef
        && actualProperties.typeRef !== 'string') {

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