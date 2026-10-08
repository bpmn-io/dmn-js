
import {
  append as svgAppend,
  attr as svgAttr,
  clear as svgClear,
  clone as svgClone,
  create as svgCreate
} from 'tiny-svg';

import { translate } from 'diagram-js/lib/util/SvgTransformUtil';

import { isPrimaryButton } from 'diagram-js/lib/util/Mouse';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import { getDecisionServiceDividerRatio } from '../../draw/DrdRenderer';

export var MIN_SECTION_HEIGHT = 40;

var HANDLE_HIT_HEIGHT = 14,
    HANDLE_INSET = 8;

var MARKER_DRAGGING = 'djs-divider-dragging';


export default function DecisionServiceDivider(
    canvas,
    dragging,
    drdFactory,
    eventBus,
    modeling,
    selection
) {
  var self = this;

  this._canvas = canvas;
  this._dragging = dragging;
  this._handle = null;

  eventBus.on('selection.changed', function(event) {
    var newSelection = event.newSelection;

    self._removeHandle();

    if (newSelection.length === 1) {
      self._addHandle(newSelection[0]);
    }
  });

  eventBus.on('shape.changed', function(event) {
    var shape = event.element;

    if (selection.isSelected(shape)) {
      self._removeHandle();
      self._addHandle(shape);
    }
  });

  eventBus.on('decisionService.divider.start', function(event) {
    var shape = event.context.shape,
        divider = canvas.getGraphics(shape).querySelector('.dmn-decision-service-divider');

    canvas.addMarker(shape, MARKER_DRAGGING);

    if (divider && self._handle) {
      var preview = svgClone(divider);

      svgAttr(preview, { y1: 0, y2: 0 });

      svgAppend(self._handle, preview);
    }
  });

  eventBus.on('decisionService.divider.move', function(event) {
    var context = event.context,
        shape = context.shape;

    context.dividerY = constrainDividerY(shape, context.dividerYAtStart, event.y);

    if (self._handle) {
      translate(self._handle, shape.x, context.dividerY);
    }
  });

  eventBus.on('decisionService.divider.end', function(event) {
    var context = event.context,
        shape = context.shape,
        dividerY = context.dividerY;

    if (dividerY === context.dividerYAtStart) {
      return;
    }

    modeling.updateModdleProperties(shape, shape.businessObject.di.decisionServiceDividerLine, {
      waypoint: drdFactory.createDiWaypoints([
        { x: shape.x, y: dividerY },
        { x: shape.x + shape.width, y: dividerY }
      ])
    });
  });

  eventBus.on('decisionService.divider.cleanup', function(event) {
    var shape = event.context.shape;

    canvas.removeMarker(shape, MARKER_DRAGGING);

    self._removeHandle();

    if (selection.isSelected(shape)) {
      self._addHandle(shape);
    }
  });
}

DecisionServiceDivider.$inject = [
  'canvas',
  'dragging',
  'drdFactory',
  'eventBus',
  'modeling',
  'selection'
];

DecisionServiceDivider.prototype.activate = function(event, shape) {
  var dividerYAtStart = getDividerY(shape);

  this._dragging.init(event, { x: shape.x, y: dividerYAtStart }, 'decisionService.divider', {
    autoActivate: true,
    cursor: 'resize-ns',
    keepSelection: true,
    data: {
      context: {
        shape: shape,
        dividerY: dividerYAtStart,
        dividerYAtStart: dividerYAtStart
      }
    }
  });
};

DecisionServiceDivider.prototype._addHandle = function(shape) {
  var self = this;

  if (!is(shape, 'dmn:DecisionService')
      || !shape.businessObject.di.decisionServiceDividerLine
      || shape.height < 2 * MIN_SECTION_HEIGHT) {
    return;
  }

  var handle = svgCreate('g', { class: 'djs-divider-handle' });

  svgAppend(handle, svgCreate('rect', {
    class: 'djs-divider-handle-hit',
    x: HANDLE_INSET,
    y: -HANDLE_HIT_HEIGHT / 2,
    width: Math.max(0, shape.width - (2 * HANDLE_INSET)),
    height: HANDLE_HIT_HEIGHT
  }));

  translate(handle, shape.x, getDividerY(shape));

  svgAppend(this._getLayer(), handle);

  this._handle = handle;

  function startDrag(event) {
    if (isPrimaryButton(event)) {
      self.activate(event, shape);
    }
  }

  handle.addEventListener('mousedown', startDrag);

  handle.addEventListener('touchstart', startDrag, { passive: true });
};

DecisionServiceDivider.prototype._removeHandle = function() {
  svgClear(this._getLayer());

  this._handle = null;
};

DecisionServiceDivider.prototype._getLayer = function() {
  return this._canvas.getLayer('dividers');
};



export function getDividerY(shape) {
  return shape.y + (shape.height * getDecisionServiceDividerRatio(shape.businessObject));
}

export function constrainDividerY(shape, dividerY, y) {
  var lower = shape.y + MIN_SECTION_HEIGHT,
      upper = shape.y + shape.height - MIN_SECTION_HEIGHT;

  (shape.children || []).forEach(function(child) {
    if (!is(child, 'dmn:Decision') || child.labelTarget) {
      return;
    }

    if (child.y + (child.height / 2) < dividerY) {
      lower = Math.max(lower, child.y + child.height);
    } else {
      upper = Math.min(upper, child.y);
    }
  });

  return Math.max(
    Math.min(lower, dividerY),
    Math.min(Math.max(upper, dividerY), y)
  );
}