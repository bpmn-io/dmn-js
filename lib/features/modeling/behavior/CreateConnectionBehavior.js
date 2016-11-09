'use strict';

var inherits = require('inherits');

var CommandInterceptor = require('diagram-js/lib/command/CommandInterceptor');

var getMid = require('diagram-js/lib/layout/LayoutUtil').getMid;

var getRequirementType = function(source) {
  switch (source.type) {
  case 'dmn:InputData':
    return 'Input';
  case 'dmn:Decision':
    return 'Decision';
  case 'dmn:KnowledgeSource':
    return 'Authority';
  case 'dmn:BusinessKnowledgeModel':
    return 'Knowledge';
  }
};

function CreateConnectionBehavior(eventBus, drdFactory, drdRules) {

  CommandInterceptor.call(this, eventBus);

  this.preExecute('connection.create', function(context) {
    var connection = context.connection,
        connectionBusinessObject = connection.businessObject,
        source =  context.source,
        target = context.target,
        sourceRef, targetRef,
        requirementType, requirement, edge;

    if (connection.type === 'dmn:Association') {
      sourceRef = drdFactory.create('dmn:DMNElementReference', {
        href: '#' + source.id
      });
      targetRef = drdFactory.create('dmn:DMNElementReference', {
        href: '#' + target.id
      });

      connectionBusinessObject.sourceRef = sourceRef;
      connectionBusinessObject.targetRef = targetRef;

      connectionBusinessObject.extensionElements = drdFactory.createDi();

      edge = drdFactory.createDiEdge(source, [ getMid(source), getMid(target)]);

      connectionBusinessObject.extensionElements.values.push(edge);

    } else {

      requirementType = getRequirementType(source);
      requirement = drdFactory.create('dmn:DMNElementReference', {
        href: '#' + source.id
      });

      connectionBusinessObject['required' + requirementType] = requirement;

      edge = drdFactory.createDiEdge(source, [ getMid(source), getMid(target)]);

      // DI
      context.di = edge;
    }
  }, true);
}


CreateConnectionBehavior.$inject = [ 'eventBus', 'drdFactory', 'drdRules' ];

inherits(CreateConnectionBehavior, CommandInterceptor);

module.exports = CreateConnectionBehavior;
