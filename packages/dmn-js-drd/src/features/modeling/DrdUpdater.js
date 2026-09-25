import { assign, find } from 'min-dash';

import inherits from 'inherits-browser';

import {
  remove as collectionRemove,
  add as collectionAdd
} from 'diagram-js/lib/util/Collections';

import {
  is,
  isAny
} from 'dmn-js-shared/lib/util/ModelUtil';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { getRequirementType } from './util/RequirementUtil.js';


/**
 * Update DMN 1.3 information.
 */
export default function DrdUpdater(
    connectionDocking,
    definitionPropertiesView,
    drdFactory,
    drdRules,
    injector
) {
  injector.invoke(CommandInterceptor, this);

  this._definitionPropertiesView = definitionPropertiesView;
  this._drdFactory = drdFactory;
  this._drdRules = drdRules;

  var self = this;

  function cropConnection(context) {
    var connection = context.connection,
        cropped = context.cropped;

    if (!cropped) {
      connection.waypoints = connectionDocking.getCroppedWaypoints(connection);

      context.cropped = true;
    }
  }

  this.executed([
    'connection.create',
    'connection.layout'
  ], cropConnection, true);

  this.reverted([ 'connection.layout' ], function(context) {
    delete context.cropped;
  }, true);

  function updateParent(context) {
    var connection = context.connection,
        parent = context.parent,
        shape = context.shape;

    if (connection && !is(connection, 'dmn:Association')) {
      parent = connection.target;
    }

    self.updateParent(shape || connection, parent);
  }

  function reverseUpdateParent(context) {
    var connection = context.connection,
        shape = context.shape;

    var oldParent = context.parent || context.newParent;

    if (connection && !is(connection, 'dmn:Association')) {
      oldParent = connection.target;
    }

    self.updateParent(shape || connection, oldParent);
  }

  this.executed([
    'connection.create',
    'connection.delete',
    'connection.move',
    'shape.create',
    'shape.delete'
  ], updateParent, true);

  this.reverted([
    'connection.create',
    'connection.delete',
    'connection.move',
    'shape.create',
    'shape.delete'
  ], reverseUpdateParent, true);

  function updateBounds(context) {
    var shape = context.shape;

    if (!(is(shape, 'dmn:DRGElement') || is(shape, 'dmn:TextAnnotation'))) {
      return;
    }

    self.updateBounds(shape);
  }

  this.executed([ 'shape.create', 'shape.move', 'shape.resize' ], updateBounds, true);

  this.reverted([ 'shape.create', 'shape.move', 'shape.resize' ], updateBounds, true);

  function updateConnectionWaypoints(context) {
    self.updateConnectionWaypoints(context);
  }

  this.executed([
    'connection.create',
    'connection.layout',
    'connection.move',
    'connection.updateWaypoints'
  ], updateConnectionWaypoints, true);

  this.reverted([
    'connection.create',
    'connection.layout',
    'connection.move',
    'connection.updateWaypoints'
  ], updateConnectionWaypoints, true);

  this.executed('connection.create', function(context) {
    var connection = context.connection,
        connectionBo = connection.businessObject,
        target = context.target,
        targetBo = target.businessObject;

    if (is(connection, 'dmn:Association')) {
      updateParent(context);
    } else {

      // parent is target
      self.updateSemanticParent(connectionBo, targetBo);
    }
  }, true);

  this.reverted('connection.create', function(context) {
    reverseUpdateParent(context);
  }, true);

  function updateReconnected(context) {
    var connection = context.connection,
        connectionBo = connection.businessObject,
        sourceChanged = context.oldSource !== context.newSource,
        targetChanged = context.oldTarget !== context.newTarget;

    if (is(connectionBo, 'dmn:Association')) {

      // only touch the endpoint that actually reconnected, so the untouched
      // reference (and any extension elements/attributes on it) is never
      // rewritten, regardless of its href format
      if (sourceChanged) {
        self.updateAssociationRef(
          connectionBo, 'sourceRef', connection.source.businessObject
        );
      }

      if (targetChanged) {
        self.updateAssociationRef(
          connectionBo, 'targetRef', connection.target.businessObject
        );
      }

      return;
    }

    self.updateSemanticParent(connectionBo, connection.target.businessObject);

    if (sourceChanged) {
      self.updateRequirementSource(connectionBo, connection.source.businessObject);
    }
  }

  this.executed('connection.reconnect', updateReconnected, true);

  this.reverted('connection.reconnect', updateReconnected, true);

  this.executed('element.updateProperties', function(context) {
    definitionPropertiesView.update();
  }, true);

  this.reverted('element.updateProperties', function(context) {
    definitionPropertiesView.update();
  }, true);

}

inherits(DrdUpdater, CommandInterceptor);

DrdUpdater.$inject = [
  'connectionDocking',
  'definitionPropertiesView',
  'drdFactory',
  'drdRules',
  'injector'
];

DrdUpdater.prototype.updateBounds = function(shape) {
  var businessObject = shape.businessObject,
      bounds = businessObject.di.bounds;

  // update bounds
  assign(bounds, {
    x: shape.x,
    y: shape.y,
    width: shape.width,
    height: shape.height
  });
};

DrdUpdater.prototype.updateConnectionWaypoints = function(context) {
  var drdFactory = this._drdFactory;

  var connection = context.connection,
      businessObject = connection.businessObject,
      edge = businessObject.di;

  edge.waypoint = drdFactory.createDiWaypoints(connection.waypoints)
    .map(function(waypoint) {
      waypoint.$parent = edge;

      return waypoint;
    });
};

DrdUpdater.prototype.updateParent = function(element, oldParent) {
  var parent = element.parent;

  if (!is(element, 'dmn:DRGElement') && !is(element, 'dmn:Artifact')) {
    parent = oldParent;
  }

  var businessObject = element.businessObject,
      parentBo = parent && parent.businessObject;

  this.updateSemanticParent(businessObject, parentBo);

  this.updateDiParent(businessObject.di, parentBo && parentBo.di);
};

DrdUpdater.prototype.updateSemanticParent = function(businessObject, parent) {
  var children,
      containment;

  if (businessObject.$parent === parent) {
    return;
  }

  if (is(businessObject, 'dmn:DRGElement')) {
    containment = 'drgElement';
  } else if (is(businessObject, 'dmn:Artifact')) {
    containment = 'artifact';
  } else if (is(businessObject, 'dmn:InformationRequirement')) {
    containment = 'informationRequirement';
  } else if (is(businessObject, 'dmn:AuthorityRequirement')) {
    containment = 'authorityRequirement';
  } else if (is(businessObject, 'dmn:KnowledgeRequirement')) {
    containment = 'knowledgeRequirement';
  }

  if (businessObject.$parent) {

    // remove from old parent
    children = businessObject.$parent.get(containment);

    collectionRemove(children, businessObject);
  }

  if (parent) {

    // add to new parent
    children = parent.get(containment);

    if (children) {
      children.push(businessObject);

      businessObject.$parent = parent;
    }
  } else {
    businessObject.$parent = null;
  }
};

DrdUpdater.prototype.updateRequirementSource = function(businessObject, source) {
  var drdFactory = this._drdFactory;

  var requirementType = getRequirementType(source);

  if (!requirementType) {
    return;
  }

  var property = 'required' + requirementType,
      existingProperty = getRequirementProperty(businessObject),
      href = '#' + source.id;

  if (property === existingProperty && businessObject.get(property).get('href') === href) {
    return;
  }

  // (re-)use the existing element reference rather than replacing it, so that
  // extension elements and attributes on it survive a reconnect (and its undo)
  var elementRef = existingProperty ?
    businessObject.get(existingProperty) :
    drdFactory.create('dmn:DMNElementReference', {});

  elementRef.set('href', href);
  elementRef.$parent = businessObject;

  if (existingProperty) {
    businessObject.set(existingProperty, undefined);
  }

  businessObject.set(property, elementRef);
};

DrdUpdater.prototype.updateAssociationRef = function(businessObject, property, element) {
  var drdFactory = this._drdFactory;

  var href = '#' + element.id,
      elementRef = businessObject.get(property);

  if (elementRef && elementRef.get('href') === href) {
    return;
  }

  // (re-)use the existing element reference rather than replacing it, so that
  // extension elements and attributes on it survive a reconnect (and its undo)
  if (!elementRef) {
    elementRef = drdFactory.create('dmn:DMNElementReference', {});

    elementRef.$parent = businessObject;

    businessObject.set(property, elementRef);
  }

  elementRef.set('href', href);
};

DrdUpdater.prototype.updateDiParent = function(di, parentDi) {

  if (di.$parent === parentDi) {
    return;
  }

  if (isAny(di, [ 'dmndi:DMNEdge', 'dmndi:DMNShape' ])) {

    var diagram = parentDi || di;
    while (!is(diagram, 'dmndi:DMNDiagram')) {
      diagram = diagram.$parent;
    }

    var diagramElements = diagram.get('diagramElements');
    if (parentDi) {
      di.$parent = diagram;

      collectionAdd(diagramElements, di);
    } else {
      di.$parent = null;

      collectionRemove(diagramElements, di);
    }
  } else {
    throw new Error('unsupported');
  }
};

// helpers //////////

var REQUIREMENT_PROPERTIES = [
  'requiredDecision',
  'requiredInput',
  'requiredKnowledge',
  'requiredAuthority'
];

function getRequirementProperty(businessObject) {
  return find(REQUIREMENT_PROPERTIES, function(property) {
    return businessObject.get(property);
  });
}
