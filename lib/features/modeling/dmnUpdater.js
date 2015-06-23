'use strict';

var inherits = require('inherits');

var CommandInterceptor = require('diagram-js/lib/command/CommandInterceptor');


/**
 * A handler responsible for updating the underlying BPMN 2.0 XML + DI
 * once changes on the diagram happen
 */
function DmnUpdater(eventBus, moddle, elementRegistry) {

  CommandInterceptor.call(this, eventBus);


  function addModel(event) {
    var newSemantic = moddle.create('dmn:DecisionRule', {
      id: event.context.row.id,
      condition: [],
      conclusion: []
    });

    newSemantic.$parent = elementRegistry.get('decisionTable').businessObject;
    newSemantic.$parent.rule.push(newSemantic);

    event.context.row.businessObject = newSemantic;
  }

  this.executed([ 'row.create' ], addModel);

}

inherits(DmnUpdater, CommandInterceptor);

module.exports = DmnUpdater;

DmnUpdater.$inject = [ 'eventBus', 'moddle', 'elementRegistry' ];
