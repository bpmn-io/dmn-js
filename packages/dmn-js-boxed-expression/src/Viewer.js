import BaseViewer from 'dmn-js-shared/lib/base/viewer/Viewer';

import {
  assign
} from 'min-dash';

import {
  domify,
  remove as domRemove
} from 'min-dom';

import TranslateModule from 'diagram-js/lib/i18n/translate';

import RenderModule from './render';
import PoweredByModule from './features/powered-by';
import LiteralExpressionModule from './features/literal-expression';
import FunctionDefinitionEditorModule from './features/function-definition';
import ViewDrdModule from './features/view-drd';
import ElementPropertiesModule from './features/element-properties';
import ElementLogicModule from './features/element-logic';
import ElementVariableModule from './features/element-variable';

/**
 * @typedef {import('dmn-js-shared/lib/base/View).OpenResult} OpenResult
 */

/**
 * @typedef {import('dmn-js-shared/lib/base/View).OpenError} OpenError
 */


export class Viewer extends BaseViewer {

  constructor(options = {}) {
    const container = Viewer._createContainer();

    super(assign(options, {
      renderer: {
        container
      }
    }));

    this._container = container;
  }

  /**
   * Open diagram element.
   *
   * @param  {ModdleElement} element
   * @returns {Promise} Resolves with {OpenResult} when successful
   * or rejects with {OpenError}
   */
  open(element) {
    const eventBus = this.get('eventBus');

    return new Promise((resolve, reject) => {
      let err;

      // use try/catch to not swallow synchronous exceptions
      // that may be raised during model parsing
      try {
        const rootElement = this.getRootElement();

        if (rootElement) {

          // clear existing literal expression
          this.clear();

          // unmount first
          eventBus.fire('renderer.unmount');
        }

        // update literal expression
        this._setRootElement(element);

        // let others know about import
        eventBus.fire('import', element);

        eventBus.fire('renderer.mount');
      } catch (e) {
        err = e;
      }

      // handle synchronously thrown exception
      if (err) {
        err.warnings = err.warnings || [];
        reject(err);
      } else {
        resolve({ warnings: [] });
      }
    });
  }

  /**
   * Initialize the viewer, returning { modules: [], config }.
   *
   * @param  {Object} options
   *
   * @return {Object} init config
   */
  _init(options) {

    let {
      modules,
      additionalModules,
      ...config
    } = options;

    let baseModules = modules || this.getModules();
    let extraModules = additionalModules || [];
    let staticModules = [
      {
        viewer: [ 'value', this ]
      }
    ];

    let allModules = [
      ...baseModules,
      ...extraModules,
      ...staticModules
    ];

    return {
      modules: allModules,
      config
    };
  }

  /**
   * Register an event listener
   *
   * Remove a previously added listener via {@link #off(event, callback)}.
   *
   * @param {string} event
   * @param {number} [priority]
   * @param {Function} callback
   * @param {Object} [that]
   */
  on(event, priority, callback, target) {
    return this.get('eventBus').on(event, priority, callback, target);
  }

  /**
   * De-register an event listener
   *
   * @param {string} event
   * @param {Function} callback
   */
  off(event, callback) {
    this.get('eventBus').off(event, callback);
  }

  /**
   * Emit an event on the underlying {@link EventBus}
   *
   * @param  {string} type
   * @param  {Object} event
   *
   * @return {Object} event processing result (if any)
   */
  _emit(type, event) {
    return this.get('eventBus').fire(type, event);
  }

  /**
   * Returns the currently displayed element.
   *
   * @return {ModdleElement}
   */
  getRootElement() {
    return this._root;
  }

  _setRootElement(element) {
    this._root = element;
  }

  /**
   * Attach viewer to given parent node.
   *
   * @param  {Element} parentNode
   */
  attachTo(parentNode) {

    if (!parentNode) {
      throw new Error('parentNode required');
    }

    // ensure we detach from the
    // previous, old parent
    this.detach();

    parentNode.appendChild(this._container);

    this._emit('attach', {});
  }

  /**
   * Detach viewer from parent node, if attached.
   */
  detach() {

    const container = this._container,
          parentNode = container.parentNode;

    if (!parentNode) {
      return;
    }

    this._emit('detach', {});

    domRemove(container);
  }

  destroy() {
    super.destroy();

    this.detach();
  }

  getModules() {
    return [
      RenderModule,
      TranslateModule,
      PoweredByModule,
      ViewDrdModule,
      ElementPropertiesModule,
      ElementLogicModule,
      FunctionDefinitionEditorModule,
      LiteralExpressionModule,
      ElementVariableModule
    ];
  }


  static _createContainer() {
    return domify(
      '<div class="dmn-boxed-expression-container"></div>'
    );
  }

}
