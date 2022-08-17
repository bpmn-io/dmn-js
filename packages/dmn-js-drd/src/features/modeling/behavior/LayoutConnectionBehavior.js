import inherits from 'inherits-browser';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import {
  is,
  isAny
} from 'dmn-js-shared/lib/util/ModelUtil';

import {
  asTRBL,
  getMid,
  getOrientation
} from 'diagram-js/lib/layout/LayoutUtil';

import {
  assign,
  forEach
} from 'min-dash';

var LOW_PRIORITY = 500;


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

  /**
   * Update incoming information requirements.
   *
   * @param {djs.model.Shape} target
   * @param {Array<djs.model.Connection>} [informationRequirements]
   * @param {string} [orientation]
   */
  function updateInformationRequirements(target, informationRequirements, orientation) {

    // (1) get information requirements
    if (!informationRequirements) {
      informationRequirements = target.incoming.filter(function(incoming) {
        return is(incoming, 'dmn:InformationRequirement');
      });
    }

    var incomingInformationRequirementsByOrientation = {};

    // (2) get information requirements per orientation
    if (orientation) {
      incomingInformationRequirementsByOrientation[ orientation ] =
        informationRequirements;
    } else {
      incomingInformationRequirementsByOrientation =
        getInformationRequirementsByOrientation(target, informationRequirements);
    }

    // (3) update information requirements per orientation
    forEach(incomingInformationRequirementsByOrientation,
      function(informationRequirements, orientation) {

        // (3.1) sort information requirements
        informationRequirements = sortInformationRequirements(
          informationRequirements,
          orientation
        );

        // (3.2) get new connection start and end
        var connectionStartEnd =
          getConnectionsStartEnd(informationRequirements, target, orientation);

        // (3.3) update information requirements
        informationRequirements.forEach((informationRequirement, index) => {
          var connectionStart = connectionStartEnd[ index ].start,
              connectionEnd = connectionStartEnd[ index ].end;

          var waypoints = layouter.layoutConnection(informationRequirement, {
            connectionStart: connectionStart,
            connectionEnd: connectionEnd
          });

          modeling.updateWaypoints(informationRequirement, waypoints);
        });
      }
    );
  }

  // update information requirements on connection create and delete
  // update information requirements of new target on connection reconnect
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
      var incomingOrientation = getOrientation(incoming.source, incoming.target);

      return is(incoming, 'dmn:InformationRequirement')
        && isSameOrientation(incomingOrientation, orientation);
    });

    if (!informationRequirements.length) {
      return;
    }

    updateInformationRequirements(target, informationRequirements, orientation);
  }, true);

  // update information requirements of old target on connection reconnect
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
      var incomingOrientation = getOrientation(incoming.source, incoming.target);

      return incoming !== connection
        && is(incoming, 'dmn:InformationRequirement')
        && isSameOrientation(incomingOrientation, orientation);
    });

    if (!informationRequirements.length) {
      return;
    }

    updateInformationRequirements(target, informationRequirements, orientation);
  }, true);

  // update information requirements on elements move
  this.postExecuted('elements.move', LOW_PRIORITY, function(context) {
    var shapes = context.shapes,
        closure = context.closure,
        enclosedConnections = closure.enclosedConnections;

    shapes.forEach(function(shape) {
      if (!isAny(shape, [ 'dmn:Decision', 'dmn:InputData' ])) {
        return;
      }

      // (1) update incoming information requirements
      var incomingInformationRequirements = shape.incoming.filter(function(incoming) {
        return is(incoming, 'dmn:InformationRequirement')
          && !enclosedConnections[ incoming.id ];
      });

      if (incomingInformationRequirements.length) {
        updateInformationRequirements(shape, incomingInformationRequirements);
      }

      // (2) update outgoing information requirements
      shape.outgoing.forEach(function(outgoing) {
        if (!is(outgoing, 'dmn:InformationRequirement')
          || enclosedConnections[ outgoing.id ]) {
          return;
        }

        updateInformationRequirements(outgoing.target);
      });
    });
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

/**
 * Get connections start and end based on number of information requirements and
 * orientation.
 *
 * @param {Array<djs.model.Connection>} informationRequirements
 * @param {djs.model.Shape} target
 * @param {string} orientation
 *
 * @returns {Array<Object>}
 */
function getConnectionsStartEnd(informationRequirements, target, orientation) {
  return informationRequirements.map(
    function(informationRequirement, index) {
      var source = informationRequirement.source,
          sourceMid = getMid(source),
          sourceTrbl = asTRBL(source),
          targetTrbl = asTRBL(target);

      var length = informationRequirements.length;

      if (orientation.includes('bottom')) {
        return {
          start: {
            x: sourceMid.x,
            y: sourceTrbl.top
          },
          end: {
            x: targetTrbl.left + target.width / (length + 1) * (index + 1),
            y: targetTrbl.bottom
          }
        };
      } else if (orientation.includes('top')) {
        return {
          start: {
            x: sourceMid.x,
            y: sourceTrbl.bottom
          },
          end: {
            x: targetTrbl.left + target.width / (length + 1) * (index + 1),
            y: targetTrbl.top
          }
        };
      } else if (orientation.includes('right')) {
        return {
          start: {
            x: sourceTrbl.left,
            y: sourceMid.y
          },
          end: {
            x: targetTrbl.right,
            y: targetTrbl.top + target.height / (length + 1) * (index + 1)
          }
        };
      } else {
        return {
          start: {
            x: sourceTrbl.right,
            y: sourceMid.y
          },
          end: {
            x: targetTrbl.left,
            y: targetTrbl.top + target.height / (length + 1) * (index + 1)
          }
        };
      }
    }
  );
}

/**
 * Get information requirements by orientation.
 *
 * @param {djs.model.shape} target
 * @param {Array<djs.model.Connection>} informationRequirements
 *
 * @returns {Object}
 */
function getInformationRequirementsByOrientation(target, informationRequirements) {
  var incomingInformationRequirementsByOrientation = {};

  informationRequirements.forEach(function(incoming) {
    var orientation = getOrientation(incoming.source, target).split('-').shift();

    if (!incomingInformationRequirementsByOrientation[ orientation ]) {
      incomingInformationRequirementsByOrientation[ orientation ] = [];
    }

    incomingInformationRequirementsByOrientation[ orientation ].push(incoming);
  });

  return incomingInformationRequirementsByOrientation;
}

function isSameOrientation(orientationA, orientationB) {
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