import {
  asTRBL,
  getMid,
  getOrientation
} from 'diagram-js/lib/layout/LayoutUtil';

import {
  isAny
} from 'dmn-js-shared/lib/util/ModelUtil';

var RECONNECT_START = 'reconnectStart',
    RECONNECT_END = 'reconnectEnd';

var HIGH_PRIORITY = 2000;


export default function DrdBendpointSnapping(eventBus) {
  eventBus.on([
    'bendpoint.move.move',
    'bendpoint.move.end'
  ], HIGH_PRIORITY, function(event) {
    var context = event.context,
        allowed = context.allowed,
        hover = context.hover,
        source = context.source,
        target = context.target,
        type = context.type;

    if (!context.hints) {
      context.hints = {};
    }

    delete context.hints.connectionStart;
    delete context.hints.connectionEnd;

    if (allowed && allowed.type !== 'dmn:InformationRequirement') {
      return;
    }

    if (!hover || !isAny(hover, [ 'dmn:Decision', 'dmn:InputData' ])) {
      return;
    }

    if (source === target) {
      return;
    }

    var reconnect = type === RECONNECT_START || type === RECONNECT_END;

    var orientation = getOrientation(source, target);

    if (reconnect && hover === source) {

      // (1) snap event to source
      snapToSource(event, orientation);

      // (2) set connection end to target
      context.hints.connectionEnd = getConnectionEnd(target, orientation);
    } else if (reconnect && hover === target) {

      // (1) set connection start to source
      context.hints.connectionStart = getConnectionStart(source, orientation);

      // (2) snap event to target
      snapToTarget(event, orientation);
    }
  });
}

DrdBendpointSnapping.$inject = [ 'eventBus' ];


// helpers //////////

function getConnectionStart(source, orientation) {
  var sourceTrbl = asTRBL(source);

  var connectionStart = getMid(source);

  if (orientation.includes('bottom')) {
    connectionStart.y = sourceTrbl.top;
  } else if (orientation.includes('top')) {
    connectionStart.y = sourceTrbl.bottom;
  } else if (orientation.includes('right')) {
    connectionStart.x = sourceTrbl.left;
  } else {
    connectionStart.x = sourceTrbl.right;
  }

  return connectionStart;
}

function getConnectionEnd(target, orientation) {
  var targetTrbl = asTRBL(target);

  var connectionEnd = getMid(target);

  if (orientation.includes('bottom')) {
    connectionEnd.y = targetTrbl.bottom;
  } else if (orientation.includes('top')) {
    connectionEnd.y = targetTrbl.top;
  } else if (orientation.includes('right')) {
    connectionEnd.x = targetTrbl.right;
  } else {
    connectionEnd.x = targetTrbl.left;
  }

  return connectionEnd;
}

function snapToSource(event, orientation) {
  var context = event.context,
      source = context.source;

  var connectionStart = getConnectionStart(source, orientation);

  var dx = event.x - connectionStart.x,
      dy = event.y - connectionStart.y;

  event.x -= dx;
  event.y -= dy;

  event.dx -= dx;
  event.dy -= dy;
}

function snapToTarget(event, orientation) {
  var context = event.context,
      target = context.target;

  var connectionEnd = getConnectionEnd(target, orientation);

  var dx = 0,
      dy = 0;

  if (orientation.includes('top') || orientation.includes('bottom')) {
    dy = event.y - connectionEnd.y;
  } else {
    dx = event.x - connectionEnd.x;
  }

  event.x -= dx;
  event.y -= dy;

  event.dx -= dx;
  event.dy -= dy;
}