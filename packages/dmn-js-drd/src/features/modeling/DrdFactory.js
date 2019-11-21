import { map } from 'min-dash';

import { isAny } from 'dmn-js-shared/lib/util/ModelUtil';


export default function DrdFactory(moddle) {
  this._model = moddle;
}

DrdFactory.$inject = [ 'moddle' ];


DrdFactory.prototype._needsId = function(element) {
  return isAny(element, [
    'dmn:Artifact',
    'dmn:DMNElement',
    'dmn:DRGElement'
  ]);
};

DrdFactory.prototype._ensureId = function(element) {
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

DrdFactory.prototype.createDiBounds = function(bounds) {
  return this.create('biodi:Bounds', bounds);
};

DrdFactory.prototype.createDiEdge = function(source, waypoints) {
  var self = this;

  return this.create('biodi:Edge', {
    source: source.id,
    waypoints: map(waypoints, function(waypoint) {
      return self.createDiWaypoint(waypoint);
    })
  });
};

DrdFactory.prototype.createDiWaypoint = function(waypoint) {
  return this.create('biodi:Waypoint', waypoint);
};

DrdFactory.prototype.createExtensionElements = function() {
  return this.create('dmn:ExtensionElements', { values: [] });
};