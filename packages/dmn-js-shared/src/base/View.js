
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
   * Open view on the given element.
   *
   * @param  {View}   view
   * @param  {Function} [done]
   */
  open(view, done=noop) {
    done();
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


// helpers //////////////////////

function noop() { }