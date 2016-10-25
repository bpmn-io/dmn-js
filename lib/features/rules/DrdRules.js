'use strict';

var is = require('../../util/ModelUtil').is;

var inherits = require('inherits');

var RuleProvider = require('diagram-js/lib/features/rules/RuleProvider');

/**
 * DRD specific modeling rule
 */
function DrdRules(eventBus) {
  RuleProvider.call(this, eventBus);
}

inherits(DrdRules, RuleProvider);

DrdRules.$inject = [ 'eventBus' ];

module.exports = DrdRules;

DrdRules.prototype.init = function() {

  this.addRule('elements.move', function(context) {

    var target = context.target,
        shapes = context.shapes,
        position = context.position;

    return canMove(shapes, target, position);
  });
};


DrdRules.prototype.canMove = canMove;


function canMove(elements, target) {

  // allow default move check to start move operation
  if (!target) {
    return true;
  }

  if (is(target, 'dmn:Definitions')) {
    return true;
  }

  return false;
}
