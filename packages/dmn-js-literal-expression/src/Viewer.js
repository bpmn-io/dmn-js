import BaseViewer from 'dmn-js-shared/lib/base/viewer/Viewer';

import {
  assign
} from 'min-dash';

import {
  domify,
  remove as domRemove
} from 'min-dom';

import TranslateModule from 'diagram-js/lib/i18n/translate';

import CoreModule from './core';
import DecisionPropertiesModule from './features/decision-properties';
import LiteralExpressionPropertiesModule from './features/literal-expression-properties';
import PoweredByModule from './features/powered-by';
import TextareaModule from './features/textarea';
import ViewDrdModule from './features/view-drd';

/**
 * @typedef {import('dmn-js-shared/lib/base/View).OpenResult} OpenResult
 */

/**
 * @typedef {import('dmn-js-shared/lib/base/View).OpenError} OpenError
 */


export default class Viewer extends BaseViewer {

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
   * @param  {ModdleElement} decision
   * @returns {Promise} Resolves with {OpenResult} when successful
   * or rejects with {OpenError}
   */
  open(decision) {
    var self = this;

    return new Promise(function(resolve, reject) {
      var err;

      // use try/catch to not swallow synchronous exceptions
      // that may be raised during model parsing
      try {

        if (self._decision) {

          // clear existing literal expression
          self.clear();

          // unmount first
          self.get('eventBus').fire('renderer.unmount');
        }

        // update literal expression
        self._decision = decision;

        // let others know about import
        self.get('eventBus').fire('import', decision);

        self.get('eventBus').fire('renderer.mount');
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
   * Initialize the literal expression, returning { modules: [], config }.
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
   * Returns the currently displayed decision.
   *
   * @return {ModdleElement}
   */
  getDecision() {
    return this._decision;
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
    return Viewer._getModules();
  }

  static _getModules() {
    return [
      CoreModule,
      TranslateModule,
      DecisionPropertiesModule,
      LiteralExpressionPropertiesModule,
      PoweredByModule,
      TextareaModule,
      ViewDrdModule
    ];
  }

  static _createContainer() {
    return domify(
      '<div class="dmn-literal-expression-container"></div>'
    );
  }

}
