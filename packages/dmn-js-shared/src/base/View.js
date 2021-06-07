
/**
 * Base view API to be implemented by viewer editors.
 */
export default class View {

  /**
   * Attach view to parentNode.
   *
   * @param  {Element} parentNode
   */
  attachTo(parentNode) { }

  /**
   * Detach view.
   */
  detach() { }

  /**
   * @typedef {Object} OpenResult
   * @property {Array<string>} warnings - Warnings occured during opening
   */

  /**
    * @typedef {Object} OpenError
    * @property {Error} error
    * @property {Array<string>} warnings - Warnings occured during opening
    */

  /**
   * Open diagram element.
   *
   * @param  {ModdleElement} view
   * @returns {Promise} Resolves with {OpenResult} when successful
   * or rejects with {OpenError}
   */
  open(view) {
    return new Promise(function(resolve, reject) {
      resolve({ warnings: [] });
    });
  }

  /**
   * Subscribe to the given event.
   *
   * @param  {string}         event
   * @param  {Array<Object>}  args
   */
  on(event, ...args) { }

  /**
   * Unsubscribe from given event.
   *
   * @param  {string}         event
   * @param  {Array<Object>}  args
   */
  off(event, ...args) { }

  /**
   * Clear view (optional method).
   */
  clear() {}

  /**
   * Destroy view (optional method).
   */
  destroy() {}
}
