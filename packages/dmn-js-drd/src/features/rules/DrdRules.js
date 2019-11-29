import {
  is,
  isAny
} from 'dmn-js-shared/lib/util/ModelUtil';

import inherits from 'inherits';

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';

import {
  every,
  isArray
} from 'min-dash';


/**
 * DRD modeling rules.
 */
export default function DrdRules(injector) {
  injector.invoke(RuleProvider, this);
}

inherits(DrdRules, RuleProvider);

DrdRules.$inject = [ 'injector' ];

DrdRules.prototype.init = function() {

  this.addRule('connection.create', function(context) {
    var source = context.source,
        target = context.target;

    return canConnect(source, target);
  });

  this.addRule('connection.reconnect', function(context) {
    var connection = context.connection,
        source = context.source,
        target = context.target;

    return canConnect(source, target, connection);
  });

  this.addRule('connection.updateWaypoints', function(context) {
    const connection = context.connection;

    return {
      type: connection.type,
      businessObject: connection.businessObject
    };
  });

  this.addRule('elements.move', function(context) {
    var target = context.target,
        shapes = context.shapes,
        position = context.position;

    return canMove(shapes, target, position);
  });

  this.addRule('shape.create', function(context) {
    var shape = context.shape,
        target = context.target;

    return canCreate(shape, target);
  });

};

DrdRules.prototype.canConnect = canConnect;

DrdRules.prototype.canCreate = canCreate;

DrdRules.prototype.canMove = canMove;


function canConnect(source, target) {
  if (!source || isLabel(source) || !target || isLabel(target)) {
    return null;
  }

  if (source === target) {
    return false;
  }

  if (is(source, 'dmn:BusinessKnowledgeModel') &&
      isAny(target, [
        'dmn:BusinessKnowledgeModel',
        'dmn:Decision'
      ])) {
    return { type: 'dmn:KnowledgeRequirement' };
  }

  if (is(source, 'dmn:Decision')) {

    if (is(target, 'dmn:Decision')) {
      return { type: 'dmn:InformationRequirement' };
    }

    if (is(target, 'dmn:KnowledgeSource')) {
      return { type: 'dmn:AuthorityRequirement' };
    }

  }

  if (is(source, 'dmn:Definitions') || is(target, 'dmn:Definitions')) {
    return false;
  }

  if (is(source, 'dmn:InputData')) {

    if (is(target, 'dmn:Decision')) {
      return { type: 'dmn:InformationRequirement' };
    }

    if (is(target, 'dmn:KnowledgeSource')) {
      return { type: 'dmn:AuthorityRequirement' };
    }

  }

  if (is(source, 'dmn:KnowledgeSource') &&
      isAny(target, [
        'dmn:BusinessKnowledgeModel',
        'dmn:Decision',
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
  return isAny(shape, [
    'dmn:BusinessKnowledgeModel',
    'dmn:Decision',
    'dmn:InputData',
    'dmn:KnowledgeSource',
    'dmn:TextAnnotation'
  ]) && is(target, 'dmn:Definitions');
}

function canMove(elements, target) {
  if (!isArray(elements)) {
    elements = [ elements ];
  }

  // allow default move check to start move operation
  if (!target) {
    return true;
  }

  if (every(elements, function(element) {
    return isAny(element, [
      'dmn:BusinessKnowledgeModel',
      'dmn:Decision',
      'dmn:InputData',
      'dmn:KnowledgeSource',
      'dmn:TextAnnotation',
      'dmn:InformationRequirement',
      'dmn:AuthorityRequirement',
      'dmn:KnowledgeRequirement',
      'dmn:Association'
    ]);
  }) && is(target, 'dmn:Definitions')) {
    return true;
  }

  return false;
}

export function isLabel(element) {
  return !!element.labelTarget;
}