'use strict';

var TestHelper = require('../spec/helper');

var domQuery = require('min-dom/lib/query');


/**
 * Create an event with global coordinates
 * computed based on the loaded diagrams canvas position and the
 * specified canvas local coordinates.
 *
 * @param {Point} point of the event local the canvas (closure)
 * @param {Object} data
 *
 * @return {Event} event, scoped to the given canvas
 */
function queryElement(selector, target, queryAll) {
  return TestHelper.getDrdJS().invoke(function(canvas) {

    if (typeof target === 'boolean') {
      queryAll = target;
      target = undefined;
    }

    target = target || canvas.getContainer();

    if (queryAll) {
      return domQuery.all(selector, target);
    }

    return domQuery(selector, target);
  });
}

module.exports.queryElement = queryElement;


function getBounds(element) {
  return element.getBoundingClientRect();
}

module.exports.getBounds = getBounds;
