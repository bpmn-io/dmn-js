import {
  getDrdJS
} from '../helper';

import {
  assign
} from 'min-dash';


function mouseEvent(type, element, opts) {
  var evt, options,
      clientX = 0,
      clientY = 0,
      relatedTarget = null,
      defaults = {
        bubbles: true,
        cancelable: true,
        view: window
      };

  if (typeof MouseEvent !== 'function') {
    evt = document.createEvent('MouseEvents');

    if (opts) {
      clientX = opts.clientX || 0;
      clientY = opts.clientY || 0;
      relatedTarget = opts.relatedTarget || null;
    }

    evt.initMouseEvent(
      type, true, true, 'window', 0, 0, 0, clientX, clientY,
      false, false, false, false, 0, relatedTarget
    );
  } else {

    options = assign(defaults, opts || {});

    evt = new MouseEvent(type, options);
  }

  return element.dispatchEvent(evt);
}


function createEvent(type, element) {
  var evt = document.createEvent('Event');

  evt.initEvent(type, true, true);

  return element.dispatchEvent(evt);
}


export function clickElement(element, isMousedown) {
  return getDrdJS().invoke(function(elementRegistry) {

    var target = elementRegistry.getGraphics(element);

    if (!target) {
      target = element;
    }

    if (isMousedown) {
      mouseEvent('mousedown', target);
    } else {
      mouseEvent('click', target);
    }
  });
}


export function inputEvent(element, value) {
  return getDrdJS().invoke(function(elementRegistry) {

    var target = elementRegistry.getGraphics(element);

    if (!target) {
      target = element;
    }

    target.value = value;

    createEvent('input', target);
  });
}
