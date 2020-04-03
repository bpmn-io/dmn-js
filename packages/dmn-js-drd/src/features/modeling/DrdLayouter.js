import inherits from 'inherits';

import BaseLayouter from 'diagram-js/lib/layout/BaseLayouter';

import {
  getMid,
  getOrientation
} from 'diagram-js/lib/layout/LayoutUtil';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import { assign } from 'min-dash';

var ADDITIONAL_WAYPOINT_DISTANCE = 20;


export default function DrdLayouter(connectionDocking) {
  this._connectionDocking = connectionDocking;
}

inherits(DrdLayouter, BaseLayouter);

DrdLayouter.$inject = [ 'connectionDocking' ];


DrdLayouter.prototype.layoutConnection = function(connection, hints) {
  var connectionDocking = this._connectionDocking;

  if (!hints) {
    hints = {};
  }

  var source = hints.source || connection.source,
      target = hints.target || connection.target,
      waypoints = hints.waypoints || connection.waypoints || [],
      connectionStart = hints.connectionStart,
      connectionEnd = hints.connectionEnd,
      orientation = getOrientation(source, target);

  if (!connectionStart) {
    connectionStart = getConnectionDocking(waypoints[ 0 ], source);
  }

  if (!connectionEnd) {
    connectionEnd = getConnectionDocking(waypoints[ waypoints.length - 1 ], target);
  }

  if (is(connection, 'dmn:InformationRequirement')) {
    waypoints = [ connectionStart, connectionEnd ];

    var croppedWaypoints = connectionDocking.getCroppedWaypoints(
      assign({}, connection, {
        waypoints: waypoints
      }),
      source,
      target
    );

    connectionEnd = croppedWaypoints.pop();

    var additionalWaypoint = {
      x: connectionEnd.x,
      y: connectionEnd.y
    };

    if (orientation.includes('bottom')) {
      additionalWaypoint.y += ADDITIONAL_WAYPOINT_DISTANCE;
    } else if (orientation.includes('top')) {
      additionalWaypoint.y -= ADDITIONAL_WAYPOINT_DISTANCE;
    } else if (orientation.includes('right')) {
      additionalWaypoint.x += ADDITIONAL_WAYPOINT_DISTANCE;
    } else {
      additionalWaypoint.x -= ADDITIONAL_WAYPOINT_DISTANCE;
    }

    waypoints = croppedWaypoints.concat([ additionalWaypoint, connectionEnd ]);

    return waypoints;
  }

  return [ connectionStart, connectionEnd ];
};

function getConnectionDocking(point, shape) {
  return point ? (point.original || point) : getMid(shape);
}
