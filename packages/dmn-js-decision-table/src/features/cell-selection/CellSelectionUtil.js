import {
  closest,
  matches,
  query
} from 'min-dom';

import cssEscape from 'css.escape';

import {
  setRange,
  getRange
} from 'selection-ranges';

export const SELECTABLE_SELECTOR = '[contenteditable]';

export const ELEMENT_SELECTOR = '[data-element-id]';


export function getElementId(node) {
  return node.getAttribute('data-element-id');
}

export function getElementCoords(node) {
  const coordsAttr = node.getAttribute('data-coords');

  if (!coordsAttr) {
    return null;
  }

  const [ row, col ] = coordsAttr.split(':');

  return {
    row,
    col
  };
}

export function getNodeByCoords(elementCoords, container) {
  const coordsAttr = `${elementCoords.row}:${elementCoords.col}`;

  return query(`[data-coords="${ cssEscape(coordsAttr) }"]`, container);
}

export function getNodeById(elementId, container) {
  return query(`[data-element-id="${ cssEscape(elementId) }"]`, container);
}

export function isUnselectableNode(node) {
  return closest(node, '.no-deselect', true);
}

/**
 * Find semantically _selectable_ element in the nodes ancestors.
 *
 * @param {Element} node
 *
 * @return {Element} node
 */
export function findSelectableAncestor(node) {
  return closest(node, ELEMENT_SELECTOR, true);
}

/**
 * Return focusable node in selectable el.
 *
 * @param  {Element} el
 *
 * @return {Element}
 */
export function getFocusableNode(el) {

  const selector = SELECTABLE_SELECTOR;

  return (
    matches(el, selector)
      ? el
      : query(selector, el)
  );
}

/**
 * Ensure element or element childNode has the proper focus.
 *
 * @param {Element} el
 */
export function ensureFocus(el) {

  const focusEl = getFocusableNode(el);

  if (!focusEl) {
    return;
  }

  // QUIRK: otherwise range and focus related actions may
  // yield errors in older browsers (PhantomJS / IE)
  if (!document.body.contains(focusEl)) {
    return;
  }

  // nothing to do, if element already has focus
  if (document.activeElement === focusEl) {
    return;
  }

  // (1) focus
  focusEl.focus();

  // (2) set cursor to element end
  const range = getRange(focusEl);

  if (!range || range.end === 0) {
    setRange(focusEl, { start: 5000, end: 5000 });
  }
}