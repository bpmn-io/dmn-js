import inherits from 'inherits';

import BaseModeling from 'diagram-js/lib/features/modeling/Modeling';

import UpdatePropertiesHandler from './cmd/UpdatePropertiesHandler.js';
import IdClaimHandler from './cmd/IdClaimHandler.js';


/**
 * DMN 1.1 modeling features activator
 *
 * @param {Canvas} canvas
 * @param {EventBus} eventBus
 * @param {ElementFactory} elementFactory
 * @param {CommandStack} commandStack
 * @param {DrdRules} drdRules
 */
export default function Modeling(
    canvas,
    eventBus,
    elementFactory,
    commandStack,
    drdRules) {

  this._canvas = canvas;
  this._drdRules = drdRules;

  BaseModeling.call(this, eventBus, elementFactory, commandStack);
}

inherits(Modeling, BaseModeling);

Modeling.$inject = [
  'canvas',
  'eventBus',
  'elementFactory',
  'commandStack',
  'drdRules'
];

Modeling.prototype.getHandlers = function() {
  var handlers = BaseModeling.prototype.getHandlers.call(this);

  handlers['element.updateProperties'] = UpdatePropertiesHandler;
  handlers['id.updateClaim'] = IdClaimHandler;

  return handlers;
};

Modeling.prototype.updateProperties = function(element, properties) {
  this._commandStack.execute('element.updateProperties', {
    element: element,
    properties: properties
  });
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

Modeling.prototype.connect = function(source, target, attrs, hints) {

  var drdRules = this._drdRules,
      rootElement = this._canvas.getRootElement();

  if (!attrs) {
    attrs = drdRules.canConnect(source, target) || { type: 'dmn:Association' };
  }

  return this.createConnection(source, target, attrs, rootElement, hints);
};
