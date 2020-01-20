import inherits from 'inherits';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';


/**
 * Defines the behaviour of what happens to the elements inside a container
 * that morphs into another DRD element
 */
export default function ReplaceElementBehaviour(eventBus, modeling) {
  CommandInterceptor.call(this, eventBus);

  this._modeling = modeling;

  this.postExecuted([ 'shape.replace' ], 1500, function(e) {
    var context = e.context,
        oldShape = context.oldShape,
        newShape = context.newShape;


    modeling.unclaimId(oldShape.businessObject.id, oldShape.businessObject);
    modeling.updateProperties(newShape, { id: oldShape.id });
  });
}

inherits(ReplaceElementBehaviour, CommandInterceptor);

ReplaceElementBehaviour.$inject = [ 'eventBus', 'modeling' ];
