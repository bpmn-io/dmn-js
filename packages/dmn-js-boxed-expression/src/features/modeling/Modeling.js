import {
  forEach
} from 'min-dash';

import UpdatePropertiesHandler
  from 'dmn-js-shared/lib/features/modeling/cmd/UpdatePropertiesHandler';


export default class Modeling {

  constructor(commandStack, viewer, eventBus) {
    this._commandStack = commandStack;
    this._viewer = viewer;
    this._eventBus = eventBus;

    // register modeling handlers
    registerHandlers(this._getHandlers(), commandStack);
  }

  _getHandlers() {
    return {
      'element.updateProperties': UpdatePropertiesHandler
    };
  }

  updateProperties(element, properties) {
    const context = {
      element,
      properties
    };

    this._commandStack.execute('element.updateProperties', context);
  }
}

Modeling.$inject = [ 'commandStack', 'viewer', 'eventBus' ];


// helpers //////////////////////

/**
 * Register handlers with the command stack
 *
 * @param {Object} handlers { id -> Handler } map
 * @param {CommandStack} commandStack
 */
function registerHandlers(handlers, commandStack) {
  forEach(handlers, function(handler, id) {
    commandStack.registerHandler(id, handler);
  });
}