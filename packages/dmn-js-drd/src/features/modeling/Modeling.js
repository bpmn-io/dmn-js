import inherits from 'inherits-browser';

import BaseModeling from 'diagram-js/lib/features/modeling/Modeling';

import IdClaimHandler from './cmd/IdClaimHandler.js';
import UpdateLabelHandler from '../label-editing/cmd/UpdateLabelHandler.js';
import UpdatePropertiesHandler from './cmd/UpdatePropertiesHandler.js';
import UpdateModdlePropertiesHandler from './cmd/UpdateModdlePropertiesHandler.js';


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

  handlers['id.updateClaim'] = IdClaimHandler;
  handlers['element.updateLabel'] = UpdateLabelHandler;
  handlers['element.updateProperties'] = UpdatePropertiesHandler;
  handlers['element.updateModdleProperties'] = UpdateModdlePropertiesHandler;

  return handlers;
};

Modeling.prototype.unclaimId = function(id, moddleElement) {
  this._commandStack.execute('id.updateClaim', {
    id: id,
    element: moddleElement
  });
};

Modeling.prototype.updateModdleProperties = function(element, moddleElement, properties) {
  this._commandStack.execute('element.updateModdleProperties', {
    element: element,
    moddleElement: moddleElement,
    properties: properties
  });
};

Modeling.prototype.updateProperties = function(element, properties) {
  this._commandStack.execute('element.updateProperties', {
    element: element,
    properties: properties
  });
};

Modeling.prototype.updateLabel = function(element, newLabel, newBounds, hints) {
  this._commandStack.execute('element.updateLabel', {
    element: element,
    newLabel: newLabel,
    newBounds: newBounds,
    hints: hints || {}
  });
};
