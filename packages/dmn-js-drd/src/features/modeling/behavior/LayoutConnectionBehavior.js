import inherits from 'inherits';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import {
  getMid,
  getOrientation
} from 'diagram-js/lib/layout/LayoutUtil';

import { assign } from 'min-dash';


export default function LayoutConnectionBehavior(injector, modeling) {
  injector.invoke(CommandInterceptor, this);

  // specify connection start and end on connection create
  this.preExecute('connection.create', function(context) {
    var connection = context.connection,
        source = context.source,
        target = context.target;

    if (!is(connection, 'dmn:InformationRequirement')) {
      return;
    }

    var orientation = getOrientation(source, target);

    if (!context.hints) {
      context.hints = {};
    }

    assign(context.hints, getConnectionHints(source, target, orientation));
  }, true);

  // reconnection information requirements on connection create and delete
  this.postExecute([
    'connection.create',
    'connection.delete'
  ], function(context) {
    var connection = context.connection,
        source = context.source,
        target = context.target;

    if (!is(connection, 'dmn:InformationRequirement')) {
      return;
    }

    var orientation = getOrientation(source, target);

    // (1) get information requirements that need to be reconnected
    var informationRequirements = target.incoming.filter(connection => {
      return is(connection, 'dmn:InformationRequirement')
        && getOrientation(connection.source, connection.target).split('-').shift() === orientation.split('-').shift();
    });

    if (!informationRequirements.length) {
      return;
    }

    // (2) sort information requirements
    informationRequirements = sortInformationRequirements(informationRequirements, orientation);

    // (3) get new docking points
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

      modeling.reconnectEnd(informationRequirement, target, dockingPoint);
    });
  }, true);
}

LayoutConnectionBehavior.$inject = [
  'injector',
  'modeling'
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