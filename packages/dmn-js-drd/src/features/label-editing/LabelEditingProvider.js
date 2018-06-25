import UpdateLabelHandler from './cmd/UpdateLabelHandler';

import {
  getLabel
} from './LabelUtil';

import {
  is
} from 'dmn-js-shared/lib/util/ModelUtil';


export default function LabelEditingProvider(
    eventBus, canvas, directEditing, commandStack
) {

  this._canvas = canvas;
  this._commandStack = commandStack;

  directEditing.registerProvider(this);

  commandStack.registerHandler('element.updateLabel', UpdateLabelHandler);

  // listen to dblclick on non-root elements
  eventBus.on('element.dblclick', function(event) {
    directEditing.activate(event.element);
  });

  // complete on followup canvas operation
  eventBus.on([
    'element.mousedown',
    'drag.init',
    'canvas.viewbox.changed'
  ], function(event) {
    directEditing.complete();
  });

  // cancel on command stack changes
  eventBus.on([ 'commandStack.changed' ], function() {
    directEditing.cancel();
  });

  eventBus.on('create.end', 500, function(e) {

    var element = e.shape;

    if (is(element, 'dmn:Decision') || is(element, 'dmn:InputData') ||
        is(element, 'dmn:BusinessKnowledgeModel') || is(element, 'dmn:KnowledgeSource')) {

      directEditing.activate(element);
    }
  });
}

LabelEditingProvider.$inject = [ 'eventBus', 'canvas', 'directEditing', 'commandStack' ];


/**
 * Activate direct editing for drgs and text annotations.
 *
 * @param  {djs.model.Base} element
 *
 * @return {Object} an object with properties bounds (position and size) and text
 */
LabelEditingProvider.prototype.activate = function(element) {

  var text = getLabel(element);

  if (text === undefined) {
    return;
  }

  var properties = this.getEditingBBox(element);

  properties.text = text;

  return properties;
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

  var style = {},
      zoom;

  zoom = canvas.zoom();

  // fixed size for internal labels:
  // on high zoom levels: text box size === bbox size
  // on low zoom levels: text box size === bbox size at 100% zoom
  // This ensures minimum bounds at low zoom levels
  if (zoom > 1) {
    bounds.width = bbox.width;
    bounds.height = bbox.height;
  } else {
    bounds.width = bbox.width / zoom;
    bounds.height = bbox.height / zoom;
  }

  // centering overlapping text box size at low zoom levels
  if (zoom < 1) {
    bounds.x = bbox.x - (bounds.width / 2 - bbox.width / 2);
    bounds.y = bbox.y - (bounds.height / 2 - bbox.height / 2);
  }

  // text annotations
  if (is(element, 'dmn:TextAnnotation')) {
    bounds.minWidth = 100;
    bounds.height = element.height;

    style.textAlign = 'left';
  }

  return { bounds: bounds, style: style };
};


LabelEditingProvider.prototype.update = function(element, newLabel) {
  this._commandStack.execute('element.updateLabel', {
    element: element,
    newLabel: newLabel
  });
};
