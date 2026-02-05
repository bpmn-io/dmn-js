import { assign } from 'min-dash';

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


/**
 * Update DMN 1.3 information.
 */
export default function DrdUpdater(
    connectionDocking,
    decisionServiceBehavior,
    definitionPropertiesView,
    drdFactory,
    drdRules,
    injector
) {
  injector.invoke(CommandInterceptor, this);

  this._definitionPropertiesView = definitionPropertiesView;
  this._drdFactory = drdFactory;
  this._drdRules = drdRules;
  this._injector = injector;
  this._decisionServiceBehavior = decisionServiceBehavior;

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

  function updateDecisionSection(context) {
    var shape = context.shape;

    if (shape && is(shape, 'dmn:Decision')) {
      var parent = shape.parent;
      var businessObject = shape.businessObject;

      if (parent && is(parent, 'dmn:DecisionService')) {
        self._decisionServiceBehavior.updateDecisionSection(shape, parent.businessObject);
      } else if (parent && is(parent, 'dmn:Definitions')) {
        self._decisionServiceBehavior.removeDecisionFromServices(businessObject, parent.businessObject);
      }
    }
  }

  this.executed([ 'shape.move' ], updateDecisionSection, true);

  this.reverted([ 'shape.move' ], updateDecisionSection, true);

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

      // Update decision services when information requirement is created
      if (is(connection, 'dmn:InformationRequirement')) {
        self.updateDecisionServicesForTarget(target);
      }
    }
  }, true);

  this.reverted('connection.create', function(context) {
    reverseUpdateParent(context);

    // Update decision services when information requirement is deleted
    var connection = context.connection,
        target = context.target;

    if (is(connection, 'dmn:InformationRequirement')) {
      self.updateDecisionServicesForTarget(target);
    }
  }, true);

  this.executed('connection.delete', function(context) {
    var connection = context.connection,
        target = connection.target;

    // Update decision services when information requirement is deleted
    if (is(connection, 'dmn:InformationRequirement')) {
      self.updateDecisionServicesForTarget(target);
    }
  }, true);

  this.reverted('connection.delete', function(context) {
    var connection = context.connection,
        target = context.target;

    // Update decision services when information requirement is restored
    if (is(connection, 'dmn:InformationRequirement')) {
      self.updateDecisionServicesForTarget(target);
    }
  }, true);

  this.executed('connection.reconnect', function(context) {
    var connection = context.connection,
        connectionBo = connection.businessObject,
        newTarget = context.newTarget,
        newTargetBo = newTarget.businessObject;

    if (is(connectionBo, 'dmn:Association')) {
      return;
    }

    self.updateSemanticParent(connectionBo, newTargetBo);
  }, true);

  this.reverted('connection.reconnect', function(context) {
    var connection = context.connection,
        connectionBo = connection.businessObject,
        oldTarget = context.oldTarget,
        oldTargetBo = oldTarget.businessObject;

    if (is(connectionBo, 'dmn:Association')) {
      return;
    }

    self.updateSemanticParent(connectionBo, oldTargetBo);
  }, true);

  // Handle shape deletion - update decision services that reference the deleted element
  this.executed('shape.delete', function(context) {
    var shape = context.shape;

    // Update decision services when a decision or input data is deleted
    if (isAny(shape, [ 'dmn:Decision', 'dmn:InputData' ])) {
      self.removeElementFromAllDecisionServices(shape);
    }
  }, true);

  this.reverted('shape.delete', function(context) {
    var shape = context.shape;

    // Re-add element references when deletion is undone
    if (isAny(shape, [ 'dmn:Decision', 'dmn:InputData' ])) {
      self.updateAllDecisionServices();
    }
  }, true);

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
  'decisionServiceBehavior',
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

  // Handle Decision being moved into DecisionService
  if (is(businessObject, 'dmn:Decision') && parent && is(parent, 'dmn:DecisionService')) {

    // Find the Definitions element (Decision still remains under Definitions)
    var definitions = parent.$parent;

    if (!definitions || !is(definitions, 'dmn:Definitions')) {
      definitions = parent;
      while (definitions && !is(definitions, 'dmn:Definitions')) {
        definitions = definitions.$parent;
      }
    }

    // In case the decision was previously referenced by any services, clean up first
    if (definitions) {
      this._decisionServiceBehavior.removeDecisionFromServices(businessObject, definitions);
    }

    // Add reference to the target DecisionService (Decision stays in Definitions)
    this._decisionServiceBehavior.addDecisionToService(businessObject, parent, definitions);

    return;
  }

  // Handle Decision being moved out of DecisionService back to Definitions
  if (is(businessObject, 'dmn:Decision') && parent && is(parent, 'dmn:Definitions')) {
    this._decisionServiceBehavior.removeDecisionFromServices(businessObject, parent);

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

/**
 * Update all decision services that contain the given decision element.
 * This should be called when information requirements change.
 *
 * @param {Element} decisionElement - The decision element whose requirements changed
 */
DrdUpdater.prototype.updateDecisionServicesForTarget = function(decisionElement) {
  var canvas = this._injector.get('canvas');
  var rootElement = canvas.getRootElement();
  var definitions = rootElement.businessObject;

  this._decisionServiceBehavior.updateServicesContainingDecision(decisionElement, definitions);
};

/**
 * Remove references to a deleted element from all decision services.
 * This should be called when a decision or input data is deleted.
 *
 * @param {Element} deletedElement - The element that was deleted
 */
DrdUpdater.prototype.removeElementFromAllDecisionServices = function(deletedElement) {
  if (!deletedElement || !deletedElement.businessObject) {
    return;
  }

  var canvas = this._injector.get('canvas');
  var rootElement = canvas.getRootElement();
  var definitions = rootElement.businessObject;

  var deletedId = deletedElement.businessObject.id;

  this._decisionServiceBehavior.removeElementFromAllServices(deletedId, definitions);
};

/**
 * Update all decision services by recalculating their inputs.
 * This is a brute-force approach used when undoing deletions.
 */
DrdUpdater.prototype.updateAllDecisionServices = function() {
  var canvas = this._injector.get('canvas');
  var rootElement = canvas.getRootElement();
  var definitions = rootElement.businessObject;

  this._decisionServiceBehavior.updateAllServices(definitions);
};
