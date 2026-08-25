import {
  forEach
} from 'min-dash';

import UpdatePropertiesHandler
  from 'dmn-js-shared/lib/features/modeling/cmd/UpdatePropertiesHandler';


export default class Modeling {

  constructor(commandStack, viewer, eventBus, moddle) {
    this._commandStack = commandStack;
    this._viewer = viewer;
    this._eventBus = eventBus;
    this._moddle = moddle;

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
      'element.updateProperties': UpdatePropertiesHandler
    };
  }

  getDecision() {
    return this._viewer.getDecision();
  }

  editDecisionName(name) {
    const decision = this.getDecision();

    const context = {
      element: decision,
      properties: {
        name
      }
    };

    this._commandStack.execute('element.updateProperties', context);
  }

  editDecisionId(id) {
    const decision = this.getDecision();

    const context = {
      element: decision,
      properties: {
        id
      }
    };

    this._commandStack.execute('element.updateProperties', context);
  }

  editLiteralExpressionText(text) {
    const decision = this.getDecision(),
          literalExpression = decision.decisionLogic;

    const context = {
      element: literalExpression,
      properties: {
        text
      }
    };

    this._commandStack.execute('element.updateProperties', context);
  }

  editExpressionLanguage(expressionLanguage) {
    const decision = this.getDecision(),
          literalExpression = decision.decisionLogic;

    const context = {
      element: literalExpression,
      properties: {
        expressionLanguage
      }
    };

    this._commandStack.execute('element.updateProperties', context);
  }

  editVariableName(name) {
    const decision = this.getDecision();
    const variable = decision.get('variable');

    if (!variable) {
      this._createVariable(decision, { name });

      return;
    }

    const context = {
      element: variable,
      properties: {
        name
      }
    };

    this._commandStack.execute('element.updateProperties', context);
  }

  editVariableType(typeRef) {
    const decision = this.getDecision();
    const variable = decision.get('variable');

    if (!variable) {
      this._createVariable(decision, { typeRef });

      return;
    }

    const context = {
      element: variable,
      properties: {
        typeRef
      }
    };

    this._commandStack.execute('element.updateProperties', context);
  }

  _createVariable(decision, properties) {
    const variable = this._moddle.create('dmn:InformationItem', {
      name: decision.get('name'),
      ...properties
    });

    variable.set('id', this._moddle.ids.nextPrefixed('InformationItem_', variable));
    variable.$parent = decision;

    this.updateProperties(decision, { variable });
  }

  updateProperties(el, props) {
    const context = {
      element: el,
      properties: props
    };

    this._commandStack.execute('element.updateProperties', context);
  }
}

Modeling.$inject = [ 'commandStack', 'viewer', 'eventBus', 'moddle' ];


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