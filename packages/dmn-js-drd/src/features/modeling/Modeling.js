import inherits from 'inherits';

import BaseModeling from 'diagram-js/lib/features/modeling/Modeling';

import UpdatePropertiesHandler from './cmd/UpdatePropertiesHandler.js';
import IdClaimHandler from './cmd/IdClaimHandler.js';


/**
 * DMN modeling.
 *
 * @param {Canvas} canvas
 * @param {CommandStack} commandStack
 * @param {DrdRules} drdRules
 * @param {ElementFactory} elementFactory
 * @param {EventBus} eventBus
 */
export default function Modeling(
    canvas,
    drdRules,
    injector
) {
  this._canvas = canvas;
  this._drdRules = drdRules;

  injector.invoke(BaseModeling, this);
}

inherits(Modeling, BaseModeling);

Modeling.$inject = [
  'canvas',
  'drdRules',
  'injector'
];

Modeling.prototype.claimId = function(id, moddleElement) {
  this._commandStack.execute('id.updateClaim', {
    id: id,
    element: moddleElement,
    claiming: true
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

Modeling.prototype.getHandlers = function() {
  var handlers = BaseModeling.prototype.getHandlers.call(this);

  handlers['element.updateProperties'] = UpdatePropertiesHandler;
  handlers['id.updateClaim'] = IdClaimHandler;

  return handlers;
};

Modeling.prototype.unclaimId = function(id, moddleElement) {
  this._commandStack.execute('id.updateClaim', {
    id: id,
    element: moddleElement
  });
};

Modeling.prototype.updateProperties = function(element, properties) {
  this._commandStack.execute('element.updateProperties', {
    element: element,
    properties: properties
  });
};
