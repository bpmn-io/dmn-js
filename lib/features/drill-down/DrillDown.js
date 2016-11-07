'use strict';

var domify = require('min-dom/lib/domify'),
    domDelegate = require('min-dom/lib/delegate');

function DrillDown(eventBus, overlays, drdRules) {
  this._eventBus = eventBus;
  this._overlays = overlays;
  this._drdRules = drdRules;

  eventBus.on([ 'drdElement.added', 'shape.create' ], function(context) {
    var element = context.element,
        canDrillDown = drdRules.canDrillDown(element);

    if (canDrillDown) {
      this.addOverlay(element, canDrillDown);
    }
  }, this);
}

module.exports = DrillDown;

DrillDown.$inject = [ 'eventBus', 'overlays', 'drdRules' ];


DrillDown.prototype.addOverlay = function(decision, decisionType) {
  var overlays = this._overlays;

  var icon = decisionType === 'table' ? 'decision-table' : 'literal-expression';

  var overlay = domify([
    '<div class="drill-down-overlay">',
    '<span class="dmn-icon-' + icon + '" />',
    '</div>'
  ].join(''));

  var overlayId = overlays.add(decision, {
    position: {
      top: 1,
      left: 1
    },
    html: overlay
  });

  this.bindEventListener(decision, overlay, overlayId);
};

DrillDown.prototype.bindEventListener = function(decision, overlay, id) {
  var overlays = this._overlays,
      eventBus = this._eventBus;

  var overlaysRoot = overlays._overlayRoot;

  domDelegate.bind(overlaysRoot, '[data-overlay-id="' + id + '"]', 'click', function() {

    eventBus.fire('decision.open', { decision: decision.businessObject });
  });
};
