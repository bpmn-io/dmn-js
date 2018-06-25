import {
  assign,
  map,
  forEach,
  pick
} from 'min-dash';

import inherits from 'inherits';

import {
  remove as collectionRemove
} from 'diagram-js/lib/util/Collections';

import {
  getBusinessObject,
  is
} from 'dmn-js-shared/lib/util/ModelUtil';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';


/**
 * A command interceptor responsible for updating elements after they've
 * been changed in the DRD view.
 */
export default function DrdUpdater(
    eventBus,
    drdFactory,
    connectionDocking,
    drdRules,
    definitionPropertiesView) {

  CommandInterceptor.call(this, eventBus);

  this._drdFactory = drdFactory;
  this._drdRules = drdRules;
  this._definitionPropertiesView = definitionPropertiesView;

  var self = this;


  // connection cropping //////////////////////

  // crop connection ends during create/update
  function cropConnection(e) {
    var context = e.context,
        connection;

    if (!context.cropped) {
      connection = context.connection;
      connection.waypoints = connectionDocking.getCroppedWaypoints(connection);
      context.cropped = true;
    }
  }

  this.executed([
    'connection.layout',
    'connection.create',
    'connection.reconnectEnd',
    'connection.reconnectStart'
  ], cropConnection);

  this.reverted([ 'connection.layout' ], function(e) {
    delete e.context.cropped;
  });


  // DRD + DI update //////////////////////

  // update parent
  function updateParent(e) {
    var context = e.context,
        element = context.shape || context.connection,
        oldParent = context.oldParent;

    // for all requirements the semantic parent is the target
    if (context.connection && !is(element, 'dmn:Association')) {
      oldParent = element.target;
    }

    self.updateParent(element, oldParent);
  }

  function reverseUpdateParent(e) {
    var context = e.context;

    var element = context.shape || context.connection,
        // oldParent is the (old) new parent, because we are undoing
        oldParent = context.parent || context.newParent;

    // for all requirements the semantic parent is the target
    if (context.connection && !is(element, 'dmn:Association')) {
      oldParent = element.target;
    }

    self.updateParent(element, oldParent);
  }

  this.executed([
    'shape.create',
    'shape.delete',
    'connection.create',
    'connection.move',
    'connection.delete'
  ], updateParent);

  this.reverted([
    'shape.create',
    'shape.delete',
    'connection.create',
    'connection.move',
    'connection.delete'
  ], reverseUpdateParent);


  // update bounds
  function updateBounds(e) {
    var shape = e.context.shape;

    if (!(is(shape, 'dmn:DRGElement') || is(shape, 'dmn:TextAnnotation'))) {
      return;
    }

    self.updateBounds(shape);
  }

  this.executed([ 'shape.create', 'shape.move' ], updateBounds);

  this.reverted([ 'shape.create', 'shape.move' ], updateBounds);

  function updateConnectionWaypoints(e) {
    self.updateConnectionWaypoints(e.context);
  }

  this.executed([
    'connection.layout',
    'connection.updateWaypoints',
    'connection.move'
  ], updateConnectionWaypoints);

  this.reverted([
    'connection.layout',
    'connection.updateWaypoints',
    'connection.move'
  ], updateConnectionWaypoints);

  this.executed([ 'connection.create' ], function(event) {
    var context = event.context,
        connection = context.connection,
        targetBO = context.target.businessObject,
        di, ext;

    if (is(connection, 'dmn:Association')) {
      updateParent(event);
    } else {
      // semantic parent is target (instead of graphical parent)
      self.updateSemanticParent(connection.businessObject, targetBO);

      // add di to target business object extension elements
      di = context.di;
      ext = targetBO.extensionElements.values;

      // fix di waypoints, due to connection cropping
      forEach(di.waypoints, function(waypoint, index) {
        waypoint.x = connection.waypoints[index].x;
        waypoint.y = connection.waypoints[index].y;
      });

      ext.push(di);
    }
  });

  this.reverted([ 'connection.create' ], function(event) {
    var context = event.context,
        connection = context.connection,
        di, ext, idx;

    reverseUpdateParent(event);

    if (!is(connection, 'dmn:Association')) {
      // remove di from target business object extension elements
      di = context.di;
      ext = context.target.businessObject.extensionElements.values;
      idx = ext.indexOf(di);

      if (idx !== -1) {
        ext.splice(idx, 1);
      }
    }
  });

  this.executed([ 'connection.delete' ], function(event) {
    var context = event.context,
        connection = getBusinessObject(context.connection),
        source = context.source,
        target = getBusinessObject(context.target),
        index;

    if (is(connection, 'dmn:Association')) {
      return;
    }

    forEach(target.extensionElements.values, function(value, idx) {
      if (is(value, 'biodi:Edge') && source.id === value.source) {
        index = idx;

        return false;
      }
    });

    if (index !== undefined) {
      context.oldDI = target.extensionElements.values[index];

      target.extensionElements.values.splice(index, 1);
    }
  });

  this.reverted([ 'connection.delete' ], function(event) {
    var context = event.context,
        connection = context.connection,
        target = getBusinessObject(context.target),
        oldDI = context.oldDI;

    if (!oldDI || is(connection, 'dmn:Association')) {
      return;
    }

    target.extensionElements.values.push(oldDI);
  });

  this.executed([ 'element.updateProperties' ], function(event) {
    definitionPropertiesView.update();
  });
  this.reverted([ 'element.updateProperties' ], function(event) {
    definitionPropertiesView.update();
  });


  this.reverted(['connection.reconnectEnd'], function(event) {
    self.updateSemanticParent(
      event.context.connection.businessObject,
      event.context.oldTarget.businessObject
    );
  });

}

inherits(DrdUpdater, CommandInterceptor);

DrdUpdater.$inject = [
  'eventBus',
  'drdFactory',
  'connectionDocking',
  'drdRules',
  'definitionPropertiesView'
];


// implementation //////////////////////

DrdUpdater.prototype.updateParent = function(element, oldParent) {
  var parentShape = element.parent;

  if (!is(element, 'dmn:DRGElement') && !is(element, 'dmn:Artifact')) {
    parentShape = oldParent;
  }

  var businessObject = element.businessObject,
      parentBusinessObject = parentShape && parentShape.businessObject;

  this.updateSemanticParent(businessObject, parentBusinessObject);

  this.updateExtensionElements(businessObject);
};


DrdUpdater.prototype.updateBounds = function(shape) {
  var drdFactory = this._drdFactory;

  var businessObject = getBusinessObject(shape),
      extensionElements = businessObject.extensionElements,
      values, bounds;

  if (!extensionElements) {
    return;
  }

  values = extensionElements.values;
  bounds = values[0];

  if (!bounds) {
    values.push(drdFactory.createDiBounds({
      x: shape.x,
      y: shape.y,
      width: shape.width,
      height: shape.height
    }));
  } else {
    values[0] = assign(bounds, {
      x: shape.x,
      y: shape.y,
      width: shape.width,
      height: shape.height
    });
  }
};


DrdUpdater.prototype.updateExtensionElements = function(businessObject) {
  var extensionElements = businessObject.extensionElements;

  if (extensionElements && !extensionElements.$parent) {
    extensionElements.$parent = businessObject;
  }
};


DrdUpdater.prototype.updateSemanticParent = function(businessObject, newParent) {

  var containment, children;

  if (businessObject.$parent === newParent) {
    return;
  }

  if (businessObject.$instanceOf('dmn:DRGElement')) {
    containment = 'drgElements';
  } else if (businessObject.$instanceOf('dmn:Artifact')) {
    containment = 'artifacts';
  } else if (businessObject.$instanceOf('dmn:InformationRequirement')) {
    containment = 'informationRequirement';
  } else if (businessObject.$instanceOf('dmn:AuthorityRequirement')) {
    containment = 'authorityRequirement';
  } else if (businessObject.$instanceOf('dmn:KnowledgeRequirement')) {
    containment = 'knowledgeRequirement';
  }

  if (businessObject.$parent) {
    // remove from old parent
    children = businessObject.$parent.get(containment);

    collectionRemove(children, businessObject);
  }

  if (!newParent) {
    businessObject.$parent = null;
  } else {
    // add to new parent
    children = newParent.get(containment);
    if (children) {
      children.push(businessObject);
      businessObject.$parent = newParent;
    }
  }
};


DrdUpdater.prototype.updateConnectionWaypoints = function(context) {
  var drdFactory = this._drdFactory;

  var connection = context.connection,
      source = connection.source,
      target = connection.target,
      extensionElements;

  if (is(connection, 'dmn:Association')) {
    extensionElements = connection.businessObject.extensionElements;
  } else {
    extensionElements = target.businessObject.extensionElements;
  }

  // update di -> target extensionElements
  extensionElements.values = map(extensionElements.values, function(value) {

    if (is(value, 'biodi:Edge') && value.source === source.id) {
      value.waypoints = [];

      forEach(connection.waypoints, function(waypoint, index) {
        var semanticWaypoint = drdFactory.createDiWaypoint(pick(waypoint, [ 'x', 'y' ]));

        semanticWaypoint.$parent = value;

        value.waypoints.push(semanticWaypoint);
      });
    }

    return value;
  });
};
