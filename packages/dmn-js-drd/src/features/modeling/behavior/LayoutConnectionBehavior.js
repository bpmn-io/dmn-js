import inherits from 'inherits';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import {
  getMid,
  getOrientation
} from 'diagram-js/lib/layout/LayoutUtil';

import { assign } from 'min-dash';


export default function LayoutConnectionBehavior(injector, layouter, modeling, rules) {
  injector.invoke(CommandInterceptor, this);

  // specify connection start and end on connection create
  this.preExecute([
    'connection.create',
    'connection.reconnect'
  ], function(context) {
    var connection = context.connection,
        source = context.newSource || context.source,
        target = context.newTarget || context.target;

    if (is(connection, 'dmn:InformationRequirement')
      && !rules.allowed('connection.connect', {
        connection: connection,
        source: source,
        target: target
      })
    ) {
      return;
    }

    if (!is(connection, 'dmn:InformationRequirement')) {
      return;
    }

    var orientation = getOrientation(source, target);

    if (!context.hints) {
      context.hints = {};
    }

    assign(context.hints, getConnectionHints(source, target, orientation));
  }, true);

  function updateInformationRequirements(target, informationRequirements, orientation) {

    // (1) sort information requirements
    informationRequirements = sortInformationRequirements(
      informationRequirements,
      orientation
    );

    // (2) get new docking points
    var dockingPoints = informationRequirements.map(function(_, index) {
      if (orientation.includes('bottom')) {
        return {
          x: target.x + target.width / (informationRequirements.length + 1) * (index + 1),
          y: target.y + target.height
        };
      } else if (orientation.includes('top')) {
        return {
          x: target.x + target.width / (informationRequirements.length + 1) * (index + 1),
          y: target.y
        };
      } else if (orientation.includes('right')) {
        return {
          x: target.x + target.width,
          y: target.y + target.height / (informationRequirements.length + 1) * (index + 1)
        };
      } else {
        return {
          x: target.x,
          y: target.y + target.height / (informationRequirements.length + 1) * (index + 1)
        };
      }
    });

    // (4) reconnection information requirements
    informationRequirements.forEach((informationRequirement, index) => {
      var dockingPoint = dockingPoints[ index ];

      var waypoints = layouter.layoutConnection(informationRequirement, {
        connectionStart: informationRequirement.waypoints[ 0 ],
        connectionEnd: dockingPoint
      });

      modeling.updateWaypoints(informationRequirement, waypoints);
    });
  }

  // lay out information requirements on connection create and delete and reconnect
  this.postExecuted([
    'connection.create',
    'connection.delete',
    'connection.reconnect'
  ], function(context) {
    var connection = context.connection,
        source = connection.source || context.source,
        target = connection.target || context.target;

    if (!is(connection, 'dmn:InformationRequirement')) {
      return;
    }

    var orientation = getOrientation(source, target);

    // update all information requirements with same orientation
    var informationRequirements = target.incoming.filter(incoming => {
      return is(incoming, 'dmn:InformationRequirement')
        && sameOrientation(getOrientation(incoming.source, incoming.target), orientation);
    });

    if (!informationRequirements.length) {
      return;
    }

    updateInformationRequirements(target, informationRequirements, orientation);
  }, true);

  this.preExecute('connection.reconnect', function(context) {
    var connection = context.connection,
        source = connection.source,
        target = connection.target;

    if (!is(connection, 'dmn:InformationRequirement')) {
      return;
    }

    var orientation = getOrientation(source, target);

    // update all information requirements with same orientation except reconnected
    var informationRequirements = target.incoming.filter(incoming => {
      return incoming !== connection
        && is(incoming, 'dmn:InformationRequirement')
        && sameOrientation(getOrientation(incoming.source, incoming.target), orientation);
    });

    if (!informationRequirements.length) {
      return;
    }

    updateInformationRequirements(target, informationRequirements, orientation);
  }, true);
}

LayoutConnectionBehavior.$inject = [
  'injector',
  'layouter',
  'modeling',
  'rules'
];

inherits(LayoutConnectionBehavior, CommandInterceptor);

// helpers //////////

function getConnectionHints(source, target, orientation) {
  var connectionStart = getMid(source),
      connectionEnd = getMid(target);

  if (orientation.includes('bottom')) {
    connectionStart.y = source.y;
    connectionEnd.y = target.y + target.height;
  } else if (orientation.includes('top')) {
    connectionStart.y = source.y + source.height;
    connectionEnd.y = target.y;
  } else if (orientation.includes('right')) {
    connectionStart.x = source.x;
    connectionEnd.x = target.x + target.width;
  } else {
    connectionStart.x = source.x + source.width;
    connectionEnd.x = target.x;
  }

  return {
    connectionStart: connectionStart,
    connectionEnd: connectionEnd
  };
}

function sameOrientation(orientationA, orientationB) {
  return orientationA
    && orientationB
    && orientationA.split('-').shift() === orientationB.split('-').shift();
}

function sortInformationRequirements(informationRequirements, orientation) {
  var axis;

  if (orientation.includes('top') || orientation.includes('bottom')) {
    axis = 'x';
  } else {
    axis = 'y';
  }

  return informationRequirements.sort(function(a, b) {
    return getMid(a.source)[ axis ] - getMid(b.source)[ axis ];
  });
}