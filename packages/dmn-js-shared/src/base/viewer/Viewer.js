import { Injector } from 'didi';

import core from './core';


/**
 * A base for React-style viewers.
 */
export default class Viewer {

  constructor(options = {}) {
    let {
      injector
    } = options;

    if (!injector) {
      let { modules, config } = this._init(options);

      injector = createInjector(config, modules);
    }

    this.get = injector.get;

    this.invoke = injector.invoke;

    this.get('eventBus').fire('viewer.init');
  }

  /**
   * Intialize and return modules and config used for creation.
   *
   * @param  {Object} options
   *
   * @return {Object} { modules=[], config }
   */
  _init(options) {
    let {
      modules,
      ...config
    } = options;

    return { modules, config };
  }

  /**
   * Destroy. This results in removing the attachment from the container.
   */
  destroy() {
    const eventBus = this.get('eventBus');

    eventBus.fire('viewer.destroy');
  }

  /**
   * Clear. Should be used to reset the state of any stateful services.
   */
  clear() {
    const eventBus = this.get('eventBus');

    eventBus.fire('viewer.clear');
  }

}


// helpers //////////////////////

function bootstrap(bootstrapModules) {

  var modules = [],
      components = [];

  function hasModule(m) {
    return modules.indexOf(m) >= 0;
  }

  function addModule(m) {
    modules.push(m);
  }

  function visit(m) {
    if (hasModule(m)) {
      return;
    }

    (m.__depends__ || []).forEach(visit);

    if (hasModule(m)) {
      return;
    }

    addModule(m);

    (m.__init__ || []).forEach(function(c) {
      components.push(c);
    });
  }

  bootstrapModules.forEach(visit);

  var injector = new Injector(modules);

  components.forEach(function(c) {

    try {

      // eagerly resolve component (fn or string)
      injector[typeof c === 'string' ? 'get' : 'invoke'](c);
    } catch (e) {
      console.error('Failed to instantiate component');
      console.error(e.stack);

      throw e;
    }
  });

  return injector;
}

function createInjector(config, modules) {
  const bootstrapModules = [
    {
      config: [ 'value', config ]
    },
    core
  ].concat(modules || []);

  return bootstrap(bootstrapModules);
}
