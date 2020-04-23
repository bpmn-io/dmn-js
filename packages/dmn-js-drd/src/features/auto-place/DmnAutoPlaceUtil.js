import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import {
  findFreePosition,
  generateGetNextPosition,
  getConnectedDistance
} from 'diagram-js/lib/features/auto-place/AutoPlaceUtil';

import {
  asTRBL,
  getMid
} from 'diagram-js/lib/layout/LayoutUtil';

import { DECISION_SIZE } from '../modeling/ElementFactory';

var DIRECTION_LEFT = 'left',
    DIRECTION_RIGHT = 'right';

var DRG_ELEMENT_MARGIN = 60,
    DRG_ELEMENT_ROW_SIZE = DECISION_SIZE.width;


export function getNewShapePosition(source, element) {
  if (is(element, 'dmn:TextAnnotation')) {
    return getTextAnnotationPosition(source, element);
  }

  if (is(element, 'dmn:DRGElement')) {
    return getDRGElementPosition(source, element);
  }
}

/**
 * Always try to place text annotations top right of source.
 */
function getTextAnnotationPosition(source, element) {

  var sourceTrbl = asTRBL(source);

  var position = {
    x: sourceTrbl.right + element.width / 2,
    y: sourceTrbl.top - 50 - element.height / 2
  };

  var nextPositionDirection = {
    y: {
      margin: -30,
      minDistance: 20
    }
  };

  return findFreePosition(
    source,
    element,
    position,
    generateGetNextPosition(nextPositionDirection)
  );
}

/**
 * Get position for DRG elements.
 *
 * @param {djs.model.Shape} source
 * @param {djs.model.Shape} element
 *
 * @returns {Point}
 */
function getDRGElementPosition(source, element) {
  var sourceTrbl = asTRBL(source),
      sourceMid = getMid(source);

  function getWeight(connection) {
    return connection.target === source ? 1 : -1;
  }

  var verticalDistance = getConnectedDistance(source, {
    defaultDistance: 180,
    direction: 's',
    getWeight: getWeight,
    filter: filter,
    reference: 'center'
  });

  var position = {
    x: sourceMid.x,
    y: sourceTrbl.bottom + verticalDistance
  };

  return findFreePosition(
    source,
    element,
    position,
    generateGetNextDRGElementPosition(source)
  );
}


// helpers //////////

function filter(connection) {
  return !is(connection, 'dmn:Association');
}

function getHorizontalDistance(a, b) {
  return Math.abs(b.x - a.x);
}

function generateGetNextDRGElementPosition(source) {
  var sourceMid = getMid(source);

  var connectedAtPositionLeft,
      connectedAtPositionRight;

  return function(element, previousPosition, connectedAtPreviousPosition) {
    var direction;

    // (1) get direction
    if (!connectedAtPositionLeft) {
      connectedAtPositionLeft = connectedAtPreviousPosition;
      connectedAtPositionRight = connectedAtPreviousPosition;

      if (getMid(connectedAtPreviousPosition).x - sourceMid.x > 0) {
        direction = DIRECTION_LEFT;
      } else {
        direction = DIRECTION_RIGHT;
      }
    } else {
      if (previousPosition.x < sourceMid.x) {
        connectedAtPositionLeft = connectedAtPreviousPosition;
      } else {
        connectedAtPositionRight = connectedAtPreviousPosition;
      }

      if (getHorizontalDistance(sourceMid, getMid(connectedAtPositionLeft))
        < getHorizontalDistance(sourceMid, getMid(connectedAtPositionRight))) {
        direction = DIRECTION_LEFT;
      } else {
        direction = DIRECTION_RIGHT;
      }
    }

    // (2) get next position
    if (direction === DIRECTION_LEFT) {
      return {
        x: Math.min(
          getMid(connectedAtPositionLeft).x - DRG_ELEMENT_ROW_SIZE - DRG_ELEMENT_MARGIN,
          asTRBL(connectedAtPositionLeft).left - DRG_ELEMENT_MARGIN - element.width / 2
        ),
        y: previousPosition.y
      };
    } else {
      return {
        x: Math.max(
          getMid(connectedAtPositionRight).x + DRG_ELEMENT_ROW_SIZE + DRG_ELEMENT_MARGIN,
          asTRBL(connectedAtPositionRight).right + DRG_ELEMENT_MARGIN + element.width / 2
        ),
        y: previousPosition.y
      };
    }
  };
}