import Table from 'table-js';

import { importDecision } from './import/Importer';

import assign from 'lodash/assign';
import isNumber from 'lodash/isNumber';

import domify from 'min-dom/lib/domify';

import annotationsModule from './features/annotations';
import coreModule from './core';
import decisionTableHeadModule from './features/decision-table-head';
import decisionTablePropertiesModule from './features/decision-table-properties';
import ruleIndicesModule from './features/rule-indices';
import rulesModule from './features/rules';
import hitPolicyModule from './features/hit-policy';


export default class Viewer extends Table {

  constructor(options = {}) {
    const container = Viewer._createContainer(options);

    super(assign(options, {
      renderer: {
        container
      }
    }));

    this._container = container;
  }

  open(decision, done) {

    // use try/catch to not swallow synchronous exceptions
    // that may be raised during model parsing
    try {
    
      if (this._decision) {
        // clear existing rendered diagram
        this.clear();
      }

      // update decision
      this._decision = decision;

      // perform import
      importDecision(this, decision, done);
    } catch (e) {
      // handle synchronous errors
      done(e);
    }
  }

  /**
   * Initialize the table, returning { modules: [], config }.
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
        decisionTable: [ 'value', this ]
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
   * @param {String} event
   * @param {Number} [priority]
   * @param {Function} callback
   * @param {Object} [that]
   */
  on(event, priority, callback, target) {
    return this.get('eventBus').on(event, priority, callback, target);
  }

  /**
   * De-register an event listener
   *
   * @param {String} event
   * @param {Function} callback
   */
  off(event, callback) {
    this.get('eventBus').off(event, callback);
  }

  /**
   * Emit an event on the underlying {@link EventBus}
   *
   * @param  {String} type
   * @param  {Object} event
   *
   * @return {Object} event processing result (if any)
   */
  _emit(type, event) {
    return this.get('eventBus').fire(type, event);
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
  
    const container = this._container;
  
    parentNode.appendChild(container);
  
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
  
    parentNode.removeChild(container);
  }

  clear() {
    console.warn('not implemented');
  }

  destroy() {
    console.warn('not implemented');
  }

  getModules() {
    return Viewer._getModules();
  }

  static _getModules() {
    return [
      annotationsModule,
      coreModule,
      decisionTableHeadModule,
      decisionTablePropertiesModule,
      ruleIndicesModule,
      rulesModule,
      hitPolicyModule
    ];
  }

  static _createContainer(options) {
    const container = domify('<div class="decision-table-container"></div>');
  
    assign(container.style, {
      width: ensureUnit(options.width),
      height: ensureUnit(options.height),
      position: options.position
    });
  
    return container;
  }
}

////////// helpers //////////

/**
 * Ensure the passed argument is a proper unit (defaulting to px)
 */
function ensureUnit(val) {
  return val + (isNumber(val) ? 'px' : '');
}