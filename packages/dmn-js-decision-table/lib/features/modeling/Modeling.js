import { assign } from 'min-dash/lib/object';

import BaseModeling from 'table-js/lib/features/modeling/Modeling';

import EditAllowedValuesHandler from './cmd/EditAllowedValuesHandler';
import EditPropertiesHandler from './cmd/EditPropertiesHandler';

export default class Modeling extends BaseModeling {
  constructor(eventBus, elementFactory, commandStack, sheet) {
    super(eventBus, elementFactory, commandStack);

    this._eventBus = eventBus;
    this._elementFactory = elementFactory;
    this._commandStack = commandStack;
    this._sheet = sheet;
  }

  getHandlers() {
    return Modeling._getHandlers();
  }

  static _getHandlers() {
    return assign({}, super._getHandlers(), {
      'editAllowedValues': EditAllowedValuesHandler,
      'editProperties': EditPropertiesHandler
    });
  }

  editDecisionTableName(name) {
    const root = this._sheet.getRoot(),
          businessObject = root.businessObject,
          parentBusinessObject = businessObject.$parent;

    const context = {
      element: parentBusinessObject,
      properties: {
        name
      }
    };

    this._commandStack.execute('editProperties', context);
  }

  editDecisionTableId(id) {
    const root = this._sheet.getRoot(),
          businessObject = root.businessObject,
          parentBusinessObject = businessObject.$parent;

    const context = {
      element: parentBusinessObject,
      properties: {
        id
      }
    };

    this._commandStack.execute('editProperties', context);
  }

  editHitPolicy(hitPolicy, aggregation) {
    const root = this._sheet.getRoot(),
          businessObject = root.businessObject;

    const context = {
      element: businessObject,
      properties: {
        hitPolicy,
        aggregation
      }
    };

    this._commandStack.execute('editProperties', context);
  }

  editInputExpression(inputExpression, text) {
    const context = {
      element: inputExpression,
      properties: {
        text
      }
    };

    this._commandStack.execute('editProperties', context);
  }

  editOutputName(output, name) {
    const context = {
      element: output,
      properties: {
        name
      }
    };

    this._commandStack.execute('editProperties', context);
  }

  editInputExpressionTypeRef(inputExpression, typeRef) {
    const context = {
      element: inputExpression,
      properties: {
        typeRef
      }
    };

    this._commandStack.execute('editProperties', context);
  }

  editOutputTypeRef(output, typeRef) {
    const context = {
      element: output,
      properties: {
        typeRef
      }
    };

    this._commandStack.execute('editProperties', context);
  }

  editCell(cell, text) {
    const context = {
      element: cell,
      properties: {
        text
      }
    };

    this._commandStack.execute('editProperties', context);
  }

  editAnnotation(rule, description) {
    const context = {
      element: rule,
      properties: {
        description
      }
    };

    this._commandStack.execute('editProperties', context);
  }

  editAllowedValues(element, allowedValues) {
    const context = {
      element,
      allowedValues
    };

    this._commandStack.execute('editAllowedValues', context);
  }

  editExpressionLanguage(element, expressionLanguage) {
    const context = {
      element,
      properties: {
        expressionLanguage
      }
    };

    this._commandStack.execute('editProperties', context);
  }
}

Modeling.$inject = [ 'eventBus', 'elementFactory', 'commandStack', 'sheet' ];