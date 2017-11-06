'use strict';

var TestHelper = require('../helper');

var DOMEvents = require('table-js/test/util/DOMEvents'),
    mouseEvent = DOMEvents.performMouseEvent,
    createEvent = DOMEvents.createEvent;


function clickElement(element, isMousedown) {
  return TestHelper.getDrdJS().invoke(function(elementRegistry) {

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

module.exports.clickElement = clickElement;


function inputEvent(element, value) {
  return TestHelper.getDrdJS().invoke(function(elementRegistry) {

    var target = elementRegistry.getGraphics(element);

    if (!target) {
      target = element;
    }

    target.value = value;

    createEvent('input', target);
  });
}

module.exports.inputEvent = inputEvent;
