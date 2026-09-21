/**
 * Get the id of the element a (possibly URI-prefixed) href points to,
 * i.e. the text after the final `#`.
 *
 * @param {string} href
 *
 * @return {string}
 */
export function getIdFromHref(href) {
  return href.split('#').pop();
}

/**
 * Check whether the given element reference points to the given id.
 *
 * @param {ModdleElement} reference - a `dmn:DMNElementReference`
 * @param {string} id
 *
 * @return {boolean}
 */
export function refersTo(reference, id) {
  return !!reference.href && getIdFromHref(reference.href) === id;
}

/**
 * Replace the id an href points to, preserving any URI prefix.
 *
 * @param {string} href
 * @param {string} id
 *
 * @return {string}
 */
export function replaceIdInHref(href, id) {
  return href.slice(0, href.lastIndexOf('#') + 1) + id;
}
