import {
  is,
  isAny
} from 'dmn-js-shared/lib/util/ModelUtil';

import inherits from 'inherits';

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';

/**
 * DRD specific modeling rule
 */
export default function DrdRules(eventBus) {
  RuleProvider.call(this, eventBus);
}

inherits(DrdRules, RuleProvider);

DrdRules.$inject = [ 'eventBus' ];

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

  this.addRule('connection.reconnectStart', function(context) {

    var connection = context.connection,
        source = context.hover || context.source,
        target = connection.target;

    return canConnect(source, target, connection);
  });

  this.addRule('connection.reconnectEnd', function(context) {

    var connection = context.connection,
        source = connection.source,
        target = context.hover || context.target;

    return canConnect(source, target, connection);
  });

  this.addRule('connection.updateWaypoints', function(context) {
    // OK! but visually ignore
    return null;
  });

  this.addRule('shape.create', function(context) {
    return canCreate(context.shape, context.target);
  });

};

DrdRules.prototype.canConnect = canConnect;

DrdRules.prototype.canCreate = canCreate;

DrdRules.prototype.canMove = canMove;


function canConnect(source, target) {

  if (is(source, 'dmn:Definitions') || is(target, 'dmn:Definitions')) {
    return false;
  }

  if (is(source, 'dmn:Decision') || is(source, 'dmn:InputData')) {
    if (is(target, 'dmn:Decision') ||
       (is(source, 'dmn:Decision') && is(target, 'dmn:InputData'))) {
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
      isAny(target, [
        'dmn:Decision',
        'dmn:BusinessKnowledgeModel',
        'dmn:KnowledgeSource'
      ])) {
    return { type: 'dmn:AuthorityRequirement' };
  }

  if (is(target, 'dmn:TextAnnotation')) {
    return { type: 'dmn:Association' };
  }

  return false;
}

function canCreate(shape, target) {
  return is(target, 'dmn:Definitions');
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
