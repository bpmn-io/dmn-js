import {
  forEach
} from 'min-dash';

import UpdatePropertiesHandler
  from 'dmn-js-shared/lib/features/modeling/cmd/UpdatePropertiesHandler';


export default class Modeling {

  constructor(eventBus, commandStack, viewer) {
    this._eventBus = eventBus;
    this._commandStack = commandStack;
    this._viewer = viewer;

    eventBus.on('viewer.init', () => {

      // register modeling handlers
      registerHandlers(this.getHandlers(), commandStack);
    });
  }

  getHandlers() {
    return Modeling._getHandlers();
  }

  static _getHandlers() {
    return {
      'updateProperties': UpdatePropertiesHandler
    };
  }

  editDecisionName(name) {
    const decision = this._viewer._decision;

    const context = {
      element: decision,
      properties: {
        name
      }
    };

    this._commandStack.execute('updateProperties', context);
  }

  editDecisionId(id) {
    const decision = this._viewer._decision;

    const context = {
      element: decision,
      properties: {
        id
      }
    };

    this._commandStack.execute('updateProperties', context);
  }

  editLiteralExpressionText(text) {
    const decision = this._viewer._decision,
          literalExpression = decision.literalExpression;

    const context = {
      element: literalExpression,
      properties: {
        text
      }
    };

    this._commandStack.execute('updateProperties', context);
  }

  editExpressionLanguage(expressionLanguage) {
    const decision = this._viewer._decision,
          literalExpression = decision.literalExpression;

    const context = {
      element: literalExpression,
      properties: {
        expressionLanguage
      }
    };

    this._commandStack.execute('updateProperties', context);
  }

  editVariableName(name) {
    const decision = this._viewer._decision,
          variable = decision.variable;

    const context = {
      element: variable,
      properties: {
        name
      }
    };

    this._commandStack.execute('updateProperties', context);
  }

  editVariableType(typeRef) {
    const decision = this._viewer._decision,
          variable = decision.variable;

    const context = {
      element: variable,
      properties: {
        typeRef
      }
    };

    this._commandStack.execute('updateProperties', context);
  }
}

Modeling.$inject = [ 'eventBus', 'commandStack', 'viewer' ];


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