'use strict';

var forEach = require('lodash/collection/forEach');

function DecisionLabelUpdater(eventBus, elementRegistry, graphicsFactory) {
  this._elementRegistry = elementRegistry;
  this._graphicsFactory = graphicsFactory;

  eventBus.on('view.switch', this.updateDecisionLabels, this);
}

DecisionLabelUpdater.$inject = [ 'eventBus', 'elementRegistry', 'graphicsFactory' ];

module.exports = DecisionLabelUpdater;

DecisionLabelUpdater.prototype.updateDecisionLabels = function(context) {
  var elementRegistry = this._elementRegistry,
      graphicsFactory = this._graphicsFactory,
      decisions;

  decisions = elementRegistry.filter(function(element) {
    return element.type === 'dmn:Decision';
  });

  forEach(decisions, function(decision) {
    var gfx = elementRegistry.getGraphics(decision.id);

    graphicsFactory.update('shape', decision, gfx);
  });

};
