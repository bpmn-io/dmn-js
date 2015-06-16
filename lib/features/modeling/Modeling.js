'use strict';

var inherits = require('inherits');

var BaseModeling = require('table-js/lib/features/modeling/Modeling');

var EditCellHandler = require('./cmd/EditCellHandler');


/**
 * DMN modeling features activator
 *
 * @param {EventBus} eventBus
 * @param {ElementFactory} elementFactory
 * @param {CommandStack} commandStack
 */
function Modeling(eventBus, elementFactory, commandStack) {
  BaseModeling.call(this, eventBus, elementFactory, commandStack);
}

inherits(Modeling, BaseModeling);

Modeling.$inject = [ 'eventBus', 'elementFactory', 'commandStack' ];

module.exports = Modeling;


Modeling.prototype.getHandlers = function() {
  var handlers = BaseModeling.prototype.getHandlers.call(this);

  handlers['cell.edit'] = EditCellHandler;

  return handlers;
};

