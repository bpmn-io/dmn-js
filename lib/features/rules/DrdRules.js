'use strict';

var ModelUtil = require('../../util/ModelUtil'),
    is = ModelUtil.is,
    isAny = ModelUtil.isAny;

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

  this.addRule('connection.create', function(context) {
    var source = context.source,
        target = context.target;

    return canConnect(source, target);
  });
};

DrdRules.prototype.canConnect = canConnect;

DrdRules.prototype.canMove = canMove;


function canConnect(source, target) {

  if (is(source, 'dmn:Decision') || is(source, 'dmn:InputData')) {
    if (is(target, 'dmn:Decision')) {
      return { type: 'dmn:InformationRequirement' };
    }

    if (is(target, 'dmn:KnowledgeSource')) {
      return { type: 'dmn:AuthorityRequirement' };
    }
  }

  if (is(source, 'dmn:BusinessKnowledgeModel') &&
      isAny(target, [ 'dmn:Decision', 'dmn:BusinessKnowledgeModel' ])) {
    return { type: 'dmn:KnowledgeRequirement' };
  }

  if (is(source, 'dmn:KnowledgeSource') &&
      isAny(target, [ 'dmn:Decision', 'dmn:BusinessKnowledgeModel', 'dmn:KnowledgeSource' ])) {
    return { type: 'dmn:AuthorityRequirement' };
  }

  return false;
}

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
