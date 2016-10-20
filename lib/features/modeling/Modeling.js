'use strict';

var inherits = require('inherits');

var BaseModeling = require('diagram-js/lib/features/modeling/Modeling');


/**
 * DMN 1.1 modeling features activator
 *
 * @param {EventBus} eventBus
 * @param {ElementFactory} elementFactory
 * @param {CommandStack} commandStack
 * @param {BpmnRules} bpmnRules
 */
function Modeling(eventBus, elementFactory, commandStack) {
  BaseModeling.call(this, eventBus, elementFactory, commandStack);
}

inherits(Modeling, BaseModeling);

Modeling.$inject = [ 'eventBus', 'elementFactory', 'commandStack' ];

module.exports = Modeling;


Modeling.prototype.getHandlers = function() {
  return BaseModeling.prototype.getHandlers.call(this);
};


Modeling.prototype.claimId = function(id, moddleElement) {
  this._commandStack.execute('id.updateClaim', {
    id: id,
    element: moddleElement,
    claiming: true
  });
};


Modeling.prototype.unclaimId = function(id, moddleElement) {
  this._commandStack.execute('id.updateClaim', {
    id: id,
    element: moddleElement
  });
};
