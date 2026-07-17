import inherits from 'inherits-browser';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';


/**
 * Assigns a default variable to newly created Decisions and Input Data.
 */
export default function CreateShapeBehavior(drdFactory, injector) {
  injector.invoke(CommandInterceptor, this);

  this.preExecute('shape.create', function(context) {
    var shape = context.shape,
        hints = context.hints || {},
        businessObject = shape.businessObject;

    if (hints.createElementsBehavior === false) {
      return;
    }

    if (businessObject.variable) {
      return;
    }

    if (!(is(shape, 'dmn:Decision') || is(shape, 'dmn:InputData'))) {
      return;
    }

    var variable = drdFactory.create('dmn:InformationItem', {
      name: businessObject.name,
      typeRef: 'Any'
    });

    variable.$parent = businessObject;
    businessObject.variable = variable;
  }, true);
}

CreateShapeBehavior.$inject = [
  'drdFactory',
  'injector'
];

inherits(CreateShapeBehavior, CommandInterceptor);
