import inherits from 'inherits';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';


/**
 * Creates DMN-specific refs for new connection.
 *
 * @param {DrdFactory} drdFactory
 * @param {Injector} injector
 */
export default function CreateConnectionBehavior(drdFactory, injector) {
  injector.invoke(CommandInterceptor, this);

  this.preExecute('connection.create', function(context) {
    var connection = context.connection,
        connectionBo = connection.businessObject,
        source = context.source,
        target = context.target,
        elementRef,
        sourceRef,
        targetRef;

    if (is(connection, 'dmn:Association')) {
      sourceRef = connectionBo.sourceRef = drdFactory
        .create('dmn:DMNElementReference', {
          href: '#' + source.id
        });

      sourceRef.$parent = connectionBo;

      targetRef = connectionBo.targetRef = drdFactory
        .create('dmn:DMNElementReference', {
          href: '#' + target.id
        });

      targetRef.$parent = connectionBo;
    } else {
      elementRef = connectionBo[ 'required' + getRequirementType(source) ] = drdFactory
        .create('dmn:DMNElementReference', {
          href: '#' + source.id
        });

      elementRef.$parent = connectionBo;
    }
  }, true);

}

CreateConnectionBehavior.$inject = [
  'drdFactory',
  'injector'
];

inherits(CreateConnectionBehavior, CommandInterceptor);


// helpers //////////

function getRequirementType(source) {
  if (is(source, 'dmn:BusinessKnowledgeModel')) {
    return 'Knowledge';
  } else if (is(source, 'dmn:Decision')) {
    return 'Decision';
  } else if (is(source, 'dmn:InputData')) {
    return 'Input';
  } else if (is(source, 'dmn:KnowledgeSource')) {
    return 'Authority';
  }
}
