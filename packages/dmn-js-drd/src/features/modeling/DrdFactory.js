import {
  assign,
  pick
} from 'min-dash';

import { isAny } from 'dmn-js-shared/lib/util/ModelUtil';


export default function DrdFactory(moddle) {
  this._model = moddle;
}

DrdFactory.$inject = [ 'moddle' ];


DrdFactory.prototype._needsId = function(element) {
  return isAny(element, [
    'dmn:Artifact',
    'dmn:DMNElement',
    'dmn:DRGElement',
    'dmndi:DMNDiagram',
    'dmndi:DMNDiagramElement'
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

DrdFactory.prototype.createDiShape = function(semantic, bounds, attrs) {

  return this.create('dmndi:DMNShape', assign({
    dmnElementRef: semantic,
    bounds: this.createDiBounds(bounds)
  }, attrs));
};

DrdFactory.prototype.createDiBounds = function(bounds) {
  return this.create('dc:Bounds', bounds);
};

DrdFactory.prototype.createDiEdge = function(semantic, waypoints, attrs) {
  return this.create('dmndi:DMNEdge', {
    dmnElementRef: semantic,
    waypoint: this.createDiWaypoints(waypoints)
  }, attrs);
};

DrdFactory.prototype.createDiWaypoints = function(waypoints) {
  var self = this;

  return waypoints.map(function(waypoint) {
    return self.createDiWaypoint(waypoint);
  });
};

DrdFactory.prototype.createDiWaypoint = function(waypoint) {
  return this.create('dc:Point', pick(waypoint, [ 'x', 'y' ]));
};

DrdFactory.prototype.createExtensionElements = function() {
  return this.create('dmn:ExtensionElements', { values: [] });
};
