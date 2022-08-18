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

function createInjector(config, modules) {
  const bootstrapModules = [
    {
      config: [ 'value', config ]
    },
    core
  ].concat(modules || []);

  const injector = new Injector(bootstrapModules);

  injector.init();

  return injector;
}
