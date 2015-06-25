'use strict';

var inherits = require('inherits');

var CommandInterceptor = require('diagram-js/lib/command/CommandInterceptor');


/**
 * A handler responsible for updating the underlying BPMN 2.0 XML + DI
 * once changes on the diagram happen
 */
function DmnUpdater(eventBus, moddle, elementRegistry) {

  CommandInterceptor.call(this, eventBus);


  function updateParent(event) {

    event.context.row.businessObject.$parent = elementRegistry.get('decisionTable').businessObject;
    event.context.row.businessObject.$parent.rule.push(event.context.row.businessObject);

  }

  this.executed([ 'row.create' ], updateParent);

}

inherits(DmnUpdater, CommandInterceptor);

module.exports = DmnUpdater;

DmnUpdater.$inject = [ 'eventBus', 'moddle', 'elementRegistry' ];
