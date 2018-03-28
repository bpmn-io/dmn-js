import {
  getDrdJS
} from '../helper';

import {
  query as domQuery,
  queryAll as domQueryAll
} from 'min-dom';


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
export function queryElement(selector, target, queryAll) {
  return getDrdJS().invoke(function(canvas) {

    if (typeof target === 'boolean') {
      queryAll = target;
      target = undefined;
    }

    target = target || canvas.getContainer();

    if (queryAll) {
      return domQueryAll(selector, target);
    }

    return domQuery(selector, target);
  });
}


export function getBounds(element) {
  return element.getBoundingClientRect();
}
