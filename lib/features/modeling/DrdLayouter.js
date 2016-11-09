'use strict';

var inherits = require('inherits');

var BaseLayouter = require('diagram-js/lib/layout/BaseLayouter');

var LayoutUtil = require('diagram-js/lib/layout/LayoutUtil');

var getMid = LayoutUtil.getMid;

function DrdLayouter() {}

inherits(DrdLayouter, BaseLayouter);

module.exports = DrdLayouter;


DrdLayouter.prototype.layoutConnection = function(connection, hints) {

  hints = hints || {};

  var source = connection.source,
      target = connection.target,
      waypoints = connection.waypoints,
      start = hints.connectionStart,
      end = hints.connectionEnd,
      middle;

  waypoints = waypoints || [];

  middle = waypoints.slice(1, waypoints.length - 1);

  if (!start) {
    start = getConnectionDocking(waypoints && waypoints[0], source);
  }

  if (!end) {
    end = getConnectionDocking(waypoints && waypoints[waypoints.length - 1], target);
  }

  return [ start ].concat(middle, [ end ]);
};

function getConnectionDocking(point, shape) {
  return point ? (point.original || point) : getMid(shape);
}
