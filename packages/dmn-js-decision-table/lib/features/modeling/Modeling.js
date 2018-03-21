import { assign } from 'min-dash';

import BaseModeling from 'table-js/lib/features/modeling/Modeling';

import UpdateAllowedValuesHandler from './cmd/UpdateAllowedValuesHandler';

import UpdatePropertiesHandler
  from 'dmn-js-shared/lib/features/modeling/cmd/UpdatePropertiesHandler';


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
      'editAllowedValues': UpdateAllowedValuesHandler,
      'updateProperties': UpdatePropertiesHandler
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

    this._commandStack.execute('updateProperties', context);
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

    this._commandStack.execute('updateProperties', context);
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

    this._commandStack.execute('updateProperties', context);
  }

  updateProperties(el, props) {
    const context = {
      element: el,
      properties: props
    };

    this._commandStack.execute('updateProperties', context);
  }

  editInputExpression(inputExpression, props) {
    const context = {
      element: inputExpression,
      properties: props
    };

    this._commandStack.execute('updateProperties', context);
  }

  editOutputName(output, name) {
    const context = {
      element: output,
      properties: {
        name
      }
    };

    this._commandStack.execute('updateProperties', context);
  }

  editInputExpressionTypeRef(inputExpression, typeRef) {
    const context = {
      element: inputExpression,
      properties: {
        typeRef
      }
    };

    this._commandStack.execute('updateProperties', context);
  }

  editOutputTypeRef(output, typeRef) {
    const context = {
      element: output,
      properties: {
        typeRef
      }
    };

    this._commandStack.execute('updateProperties', context);
  }

  editCell(cell, text) {
    const context = {
      element: cell,
      properties: {
        text
      }
    };

    this._commandStack.execute('updateProperties', context);
  }

  editAnnotation(rule, description) {
    const context = {
      element: rule,
      properties: {
        description
      }
    };

    this._commandStack.execute('updateProperties', context);
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

    this._commandStack.execute('updateProperties', context);
  }
}

Modeling.$inject = [ 'eventBus', 'elementFactory', 'commandStack', 'sheet' ];