'use strict';

var assign = require('lodash/object/assign'),
    map = require('lodash/collection/map'),
    inherits = require('inherits');

var Collections = require('diagram-js/lib/util/Collections'),
    Model = require('diagram-js/lib/model');

var ModelUtil = require('../../util/ModelUtil'),
    getBusinessObject = ModelUtil.getBusinessObject,
    is = ModelUtil.is;

var CommandInterceptor = require('diagram-js/lib/command/CommandInterceptor');

/**
 * A handler responsible for updating the underlying DMN 1.1 XML + DI
 * once changes on the diagram happen
 */
function DrdUpdater(eventBus, drdFactory) {

  CommandInterceptor.call(this, eventBus);

  this._drdFactory = drdFactory;

  var self = this;

  ////// BPMN + DI update /////////////////////////


  // update parent
  function updateParent(e) {
    var context = e.context;

    self.updateParent(context.shape || context.connection, context.oldParent);
  }

  function reverseUpdateParent(e) {
    var context = e.context;

    var element = context.shape || context.connection,
        // oldParent is the (old) new parent, because we are undoing
        oldParent = context.parent || context.newParent;

    self.updateParent(element, oldParent);
  }

  this.executed([ 'shape.create', 'shape.delete' ], updateParent);

  this.reverted([ 'shape.create', 'shape.delete' ], reverseUpdateParent);


  // update bounds
  function updateBounds(e) {
    var shape = e.context.shape;

    if (!is(shape, 'dmn:NamedElement')) {
      return;
    }

    self.updateBounds(shape);
  }

  this.executed([ 'shape.create', 'shape.move' ], updateBounds);

  this.reverted([ 'shape.create', 'shape.move' ], updateBounds);

  function updateConnectionWaypoints(e) {
    self.updateConnectionWaypoints(e.context);
  }

  this.executed([ 'connection.layout' ], updateConnectionWaypoints);

  this.reverted([ 'connection.layout' ], updateConnectionWaypoints);

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

}

inherits(DrdUpdater, CommandInterceptor);

module.exports = DrdUpdater;

DrdUpdater.$inject = [ 'eventBus', 'drdFactory' ];


/////// implementation //////////////////////////////////

DrdUpdater.prototype.updateParent = function(element, oldParent) {
  // do not update BPMN 2.0 label parent
  if (element instanceof Model.Label) {
    return;
  }

  var parentShape = element.parent;

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

  if (!extensionElements.$parent) {
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

    Collections.remove(children, businessObject);
  }

  if (!newParent) {
    businessObject.$parent = null;
  } else {
    // add to new parent
    children = newParent.get(containment);
    children.push(businessObject);

    businessObject.$parent = newParent;
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
      value.waypoints = drdFactory.createDiWaypoints(connection.waypoints[0], connection.waypoints[1]);

      value.waypoints[0].$parent = value;
      value.waypoints[1].$parent = value;
    }

    return value;
  });
};
