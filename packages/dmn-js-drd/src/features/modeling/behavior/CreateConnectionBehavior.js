import inherits from 'inherits';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { getMid } from 'diagram-js/lib/layout/LayoutUtil';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';


/**
 * Create DI for new connections.
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
        targetRef,
        extensionElements;

    // create DI
    var edge = context.di = drdFactory.createDiEdge(source, [
      getMid(source),
      getMid(target)
    ]);

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

      extensionElements = connectionBo.extensionElements = drdFactory
        .create('dmn:ExtensionElements');

      extensionElements.values = [ edge ];

      edge.$parent = extensionElements;
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
