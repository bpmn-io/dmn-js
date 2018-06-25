import {
  forEach
} from 'min-dash';


export default function DrdFactory(moddle) {
  this._model = moddle;
}

DrdFactory.$inject = [ 'moddle' ];


DrdFactory.prototype._needsId = function(element) {
  return element.$instanceOf('dmn:DRGElement') ||
         element.$instanceOf('dmn:Artifact') ||
         element.$instanceOf('dmn:DMNElement');
};

DrdFactory.prototype._ensureId = function(element) {

  // generate semantic ids for elements
  // dmn:Decision -> Decision_ID
  var prefix = (element.$type || '').replace(/^[^:]*:/g, '') + '_';

  if (!element.id && this._needsId(element)) {
    element.id = this._model.ids.nextPrefixed(prefix, element);
  }
};

DrdFactory.prototype.create = function(type, attrs) {
  var element = this._model.create(type, attrs || {});

  this._ensureId(element);

  return element;
};

DrdFactory.prototype.createDi = function() {
  return this.create('dmn:ExtensionElements', { values: [] });
};

DrdFactory.prototype.createDiBounds = function(bounds) {
  return this.create('biodi:Bounds', bounds);
};

DrdFactory.prototype.createDiEdge = function(source, waypoints) {
  var self = this;
  var semanticWaypoints = [];

  forEach(waypoints || [], function(wp) {
    semanticWaypoints.push(self.createDiWaypoint(wp));
  });

  return this.create('biodi:Edge', {
    waypoints: semanticWaypoints,
    source: source.id
  });
};

DrdFactory.prototype.createDiWaypoint = function(waypoint) {
  return this.create('biodi:Waypoint', waypoint);
};