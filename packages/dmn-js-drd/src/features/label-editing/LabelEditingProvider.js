import { getLabel } from './LabelUtil';

import {
  is
} from 'dmn-js-shared/lib/util/ModelUtil';

import {
  assign,
  isDefined
} from 'min-dash';


export default function LabelEditingProvider(
    canvas,
    directEditing,
    eventBus,
    modeling,
    textRenderer
) {

  this._canvas = canvas;
  this._modeling = modeling;
  this._textRenderer = textRenderer;

  directEditing.registerProvider(this);

  // listen to dblclick on non-root elements
  eventBus.on('element.dblclick', function(event) {
    directEditing.activate(event.element);
  });

  // complete on followup canvas operation
  eventBus.on([
    'autoPlace.start',
    'canvas.viewbox.changing',
    'drag.init',
    'drillDown.click',
    'element.mousedown',
    'popupMenu.open'
  ], function() {
    directEditing.complete();
  });

  // cancel on command stack changes
  eventBus.on([ 'commandStack.changed' ], function() {
    directEditing.cancel();
  });

  eventBus.on('create.end', 500, function(e) {

    var element = e.shape;

    if (
      is(element, 'dmn:Decision') ||
      is(element, 'dmn:InputData') ||
      is(element, 'dmn:BusinessKnowledgeModel') ||
      is(element, 'dmn:KnowledgeSource') ||
      is(element, 'dmn:TextAnnotation')
    ) {
      directEditing.activate(element);
    }
  });

  eventBus.on('autoPlace.end', 500, function(event) {
    directEditing.activate(event.shape);
  });
}

LabelEditingProvider.$inject = [
  'canvas',
  'directEditing',
  'eventBus',
  'modeling',
  'textRenderer'
];


/**
 * Activate direct editing for drgs and text annotations.
 *
 * @param  {djs.model.Base} element
 *
 * @return {Object} an object with properties bounds (position and size) and text
 */
LabelEditingProvider.prototype.activate = function(element) {

  var text = getLabel(element);

  if (!isDefined(text)) {
    return;
  }

  var context = {
    text: text
  };

  var editingBBox = this.getEditingBBox(element);

  assign(context, editingBBox);

  var options = {};

  // DRG elements
  if (is(element, 'dmn:DRGElement')) {
    assign(options, {
      centerVertically: true
    });
  }

  // text annotations
  if (is(element, 'dmn:TextAnnotation')) {
    assign(options, {
      resizable: true
    });
  }

  assign(context, {
    options: options
  });

  return context;
};


/**
 * Get the editing bounding box based on the element's size and position
 *
 * @param  {djs.model.Base} element
 *
 * @return {Object}
 *         an object containing information about position and
 *         size (fixed or minimum and/or maximum)
 */
LabelEditingProvider.prototype.getEditingBBox = function(element) {
  var canvas = this._canvas;

  var target = element.label || element;

  var bbox = canvas.getAbsoluteBBox(target);

  // default position
  var bounds = { x: bbox.x, y: bbox.y };

  var zoom = canvas.zoom();

  var defaultStyle = this._textRenderer.getDefaultStyle();

  // take zoom into account
  var defaultFontSize = defaultStyle.fontSize * zoom,
      defaultLineHeight = defaultStyle.lineHeight;

  var style = {
    fontFamily: this._textRenderer.getDefaultStyle().fontFamily,
    fontWeight: this._textRenderer.getDefaultStyle().fontWeight
  };

  // DRG elements
  if (is(element, 'dmn:DRGElement')) {
    assign(bounds, {
      width: bbox.width,
      height: bbox.height
    });

    assign(style, {
      fontSize: defaultFontSize + 'px',
      lineHeight: defaultLineHeight,
      paddingTop: (7 * zoom) + 'px',
      paddingBottom: (7 * zoom) + 'px',
      paddingLeft: (5 * zoom) + 'px',
      paddingRight: (5 * zoom) + 'px'
    });
  }

  // text annotations
  if (is(element, 'dmn:TextAnnotation')) {
    assign(bounds, {
      width: bbox.width,
      height: bbox.height,
      minWidth: 30 * zoom,
      minHeight: 10 * zoom
    });

    assign(style, {
      textAlign: 'left',
      paddingTop: (5 * zoom) + 'px',
      paddingBottom: (7 * zoom) + 'px',
      paddingLeft: (7 * zoom) + 'px',
      paddingRight: (5 * zoom) + 'px',
      fontSize: defaultFontSize + 'px',
      lineHeight: defaultLineHeight
    });
  }

  return { bounds: bounds, style: style };
};


LabelEditingProvider.prototype.update = function(
    element,
    newLabel,
    activeContextText,
    bounds
) {
  var newBounds,
      bbox;

  if (is(element, 'dmn:TextAnnotation')) {

    bbox = this._canvas.getAbsoluteBBox(element);

    newBounds = {
      x: element.x,
      y: element.y,
      width: element.width / bbox.width * bounds.width,
      height: element.height / bbox.height * bounds.height
    };
  }

  if (isEmptyText(newLabel)) {
    newLabel = null;
  }

  this._modeling.updateLabel(element, newLabel, newBounds);
};

// helpers //////////

function isEmptyText(label) {
  return !label || !label.trim();
}