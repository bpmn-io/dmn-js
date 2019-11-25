import inherits from 'inherits';

import BaseLayouter from 'diagram-js/lib/layout/BaseLayouter';

import {
  getMid
} from 'diagram-js/lib/layout/LayoutUtil';

export default function DrdLayouter() {}

inherits(DrdLayouter, BaseLayouter);


DrdLayouter.prototype.layoutConnection = function(connection, hints) {

  hints = hints || {};

  var source = hints.source || connection.source,
      target = hints.target || connection.target,
      waypoints = hints.waypoints || connection.waypoints,
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
