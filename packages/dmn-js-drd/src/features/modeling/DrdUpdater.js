import {
  assign,
  find,
  forEach
} from 'min-dash';

import inherits from 'inherits';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';


/**
 * Update DMN 1.1 information.
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

  this.executed([ 'shape.create', 'shape.move' ], updateBounds, true);

  this.reverted([ 'shape.create', 'shape.move' ], updateBounds, true);

  function updateConnectionWaypoints(context) {
    self.updateConnectionWaypoints(context);
  }

  this.executed([
    'connection.layout',
    'connection.move',
    'connection.updateWaypoints'
  ], updateConnectionWaypoints, true);

  this.reverted([
    'connection.layout',
    'connection.move',
    'connection.updateWaypoints'
  ], updateConnectionWaypoints, true);

  this.executed('connection.create', function(context) {
    var connection = context.connection,
        connectionBo = connection.businessObject,
        target = context.target,
        targetBo = target.businessObject,
        extensionElements = targetBo.get('extensionElements'),
        di = context.di;

    if (is(connection, 'dmn:Association')) {
      updateParent(context);
    } else {

      // parent is target
      self.updateSemanticParent(connectionBo, targetBo);

      // fix DI waypoints after connection cropping
      forEach(di.waypoints, function(waypoint, index) {
        waypoint.x = connection.waypoints[ index ].x;
        waypoint.y = connection.waypoints[ index ].y;
      });

      extensionElements.get('values').push(di);
    }
  }, true);

  this.reverted('connection.create', function(context) {
    var connection = context.connection,
        target = context.target,
        targetBo = target.businessObject,
        extensionElements = targetBo.get('extensionElements'),
        di = context.di;

    reverseUpdateParent(context);

    if (!is(connection, 'dmn:Association') &&
      includes(extensionElements.get('values'), di)) {
      remove(extensionElements.get('values'), di);
    }
  }, true);

  this.executed('connection.delete', function(context) {
    var connection = context.connection,
        source = context.source,
        target = context.target,
        targetBo = target.businessObject,
        extensionElements = targetBo.get('extensionElements');

    if (is(connection, 'dmn:Association')) {
      return;
    }

    var edge = find(extensionElements.get('values'), function(extensionElement) {
      return is(extensionElement, 'biodi:Edge') && extensionElement.source === source.id;
    });

    if (edge) {
      context.oldDI = edge;

      remove(extensionElements.get('values'), edge);
    }
  }, true);

  this.reverted('connection.delete', function(context) {
    var connection = context.connection,
        target = context.target,
        oldDI = context.oldDI,
        targetBo = target.businessObject,
        extensionElements = targetBo.get('extensionElements');

    if (!oldDI || is(connection, 'dmn:Association')) {
      return;
    }

    extensionElements.get('values').push(oldDI);
  }, true);

  this.executed('connection.reconnect', function(context) {
    var connection = context.connection,
        connectionBo = connection.businessObject,
        oldSource = context.oldSource,
        newSource = context.newSource,
        oldTarget = context.oldTarget,
        oldTargetBo = oldTarget.businessObject,
        oldTargetBoExtensionElements = oldTargetBo.get('extensionElements'),
        newTarget = context.newTarget,
        newTargetBo = newTarget.businessObject,
        newTargetBoExtensionElements = newTargetBo.get('extensionElements');

    self.updateSemanticParent(connectionBo, newTargetBo);

    var edge = find(oldTargetBoExtensionElements.get('values'),
      function(extensionElement) {
        var source = extensionElement.source;

        return is(extensionElement, 'biodi:Edge') && source === oldSource.id;
      }
    );

    if (edge) {

      // (1) remove edge from old target
      remove(oldTargetBoExtensionElements.get('values'), edge);

      // (2) add edge to new target
      if (!is(newTarget, 'dmn:TextAnnotation')) {
        newTargetBoExtensionElements.get('values').push(edge);
      }

      // (3) reference new source
      if (newSource) {
        edge.source = newSource.id;
      }
    }
  }, true);

  this.reverted('connection.reconnect', function(context) {
    var connection = context.connection,
        connectionBo = connection.businessObject,
        oldSource = context.oldSource,
        newSource = context.newSource,
        oldTarget = context.oldTarget,
        oldTargetBo = oldTarget.businessObject,
        oldTargetBoExtensionElements = oldTargetBo.get('extensionElements'),
        newTarget = context.newTarget,
        newTargetBo = newTarget.businessObject,
        newTargetBoExtensionElements = newTargetBo.get('extensionElements');

    self.updateSemanticParent(connectionBo, oldTargetBo);

    var edge = find(newTargetBoExtensionElements.get('values'),
      function(extensionElement) {
        var source = extensionElement.source;

        return is(extensionElement, 'biodi:Edge') &&
          source === (newSource || oldSource).id;
      }
    );

    if (edge) {

      // (1) remove edge from new target
      if (!is(newTarget, 'dmn:TextAnnotation')) {
        remove(newTargetBoExtensionElements.get('values'), edge);
      }

      // (2) add edge to old target
      oldTargetBoExtensionElements.get('values').push(edge);

      // (3) reference old source
      if (oldSource) {
        edge.source = oldSource.id;
      }
    }
  }, true);

  this.executed('element.updateProperties', function(context) {
    definitionPropertiesView.update();

    var element = context.element,
        outgoing = element.outgoing;

    if (!isIdChange(context) || !outgoing) {
      return;
    }

    var oldProperties = context.oldProperties,
        properties = context.properties;

    forEach(outgoing, function(connection) {
      var target = connection.target,
          targetBo = target.businessObject,
          extensionElements = targetBo.get('extensionElements');

      var edge = find(extensionElements.get('values'), function(extensionElement) {
        return is(extensionElement, 'biodi:Edge') &&
          extensionElement.source === oldProperties.id;
      });

      if (edge) {
        edge.source = properties.id;
      }
    });

  }, true);

  this.reverted('element.updateProperties', function(context) {
    definitionPropertiesView.update();

    var element = context.element,
        outgoing = element.outgoing;

    if (!isIdChange(context) || !outgoing) {
      return;
    }

    var oldProperties = context.oldProperties,
        properties = context.properties;

    forEach(outgoing, function(connection) {
      var target = connection.target,
          targetBo = target.businessObject,
          extensionElements = targetBo.get('extensionElements');

      var edge = find(extensionElements.get('values'), function(extensionElement) {
        return is(extensionElement, 'biodi:Edge') &&
          extensionElement.source === properties.id;
      });

      if (edge) {
        edge.source = oldProperties.id;
      }
    });
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
  var drdFactory = this._drdFactory;

  var businessObject = shape.businessObject,
      extensionElements = businessObject.get('extensionElements'),
      bounds;

  if (!extensionElements) {
    return;
  }

  bounds = find(extensionElements.get('values'), function(extensionElement) {
    return is(extensionElement, 'biodi:Bounds');
  });

  if (bounds) {

    // update bounds
    assign(bounds, {
      x: shape.x,
      y: shape.y,
      width: shape.width,
      height: shape.height
    });
  } else {

    // create bounds
    extensionElements.get('values').push(drdFactory.createDiBounds({
      x: shape.x,
      y: shape.y,
      width: shape.width,
      height: shape.height
    }));
  }
};

DrdUpdater.prototype.updateConnectionWaypoints = function(context) {
  var drdFactory = this._drdFactory;

  var connection = context.connection,
      connectionBo = connection.businessObject,
      source = connection.source,
      target = connection.target,
      targetBo = target.businessObject,
      extensionElements;

  if (is(connection, 'dmn:Association')) {
    extensionElements = connectionBo.get('extensionElements');
  } else {
    extensionElements = targetBo.get('extensionElements');
  }

  var edge = find(extensionElements.get('values'), function(extensionElement) {
    return is(extensionElement, 'biodi:Edge') &&
      extensionElement.source === source.id;
  });

  if (edge) {
    edge.waypoints = drdFactory
      .createDiWaypoints(connection.waypoints)
      .map(function(waypoint) {
        waypoint.$parent = edge;

        return waypoint;
      });
  }
};

DrdUpdater.prototype.updateParent = function(element, oldParent) {
  var parent = element.parent;

  if (!is(element, 'dmn:DRGElement') && !is(element, 'dmn:Artifact')) {
    parent = oldParent;
  }

  var businessObject = element.businessObject,
      parentBo = parent && parent.businessObject;

  this.updateSemanticParent(businessObject, parentBo);
};

DrdUpdater.prototype.updateSemanticParent = function(businessObject, parent) {
  var children,
      containment;

  if (businessObject.$parent === parent) {
    return;
  }

  if (is(businessObject, 'dmn:DRGElement')) {
    containment = 'drgElements';
  } else if (is(businessObject, 'dmn:Artifact')) {
    containment = 'artifacts';
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

    remove(children, businessObject);
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

// helpers //////////

function includes(array, item) {
  return array.indexOf(item) !== -1;
}

function isIdChange(context) {
  return !!context.properties.id;
}

function remove(array, item) {
  array.splice(array.indexOf(item), 1);

  return array;
}
