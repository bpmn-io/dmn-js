import { assign } from 'min-dash';

import BaseModeling from 'table-js/lib/features/modeling/Modeling';

import UpdateAllowedValuesHandler from './cmd/UpdateAllowedValuesHandler';
import UpdatePropertiesHandler
  from 'dmn-js-shared/lib/features/modeling/cmd/UpdatePropertiesHandler';
import IdClaimHandler from './cmd/IdClaimHandler';


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
      'element.updateProperties': UpdatePropertiesHandler,
      'id.updateClaim': IdClaimHandler
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

    this._commandStack.execute('element.updateProperties', context);
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

    this._commandStack.execute('element.updateProperties', context);
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

    this._commandStack.execute('element.updateProperties', context);
  }

  updateProperties(el, props) {
    const context = {
      element: el,
      properties: props
    };

    this._commandStack.execute('element.updateProperties', context);
  }

  editInputExpression(inputExpression, props) {
    const context = {
      element: inputExpression,
      properties: props
    };

    this._commandStack.execute('element.updateProperties', context);
  }

  editOutputName(output, name) {
    const context = {
      element: output,
      properties: {
        name
      }
    };

    this._commandStack.execute('element.updateProperties', context);
  }

  editInputExpressionTypeRef(inputExpression, typeRef) {
    const context = {
      element: inputExpression,
      properties: {
        typeRef
      }
    };

    this._commandStack.execute('element.updateProperties', context);
  }

  editOutputTypeRef(output, typeRef) {
    const context = {
      element: output,
      properties: {
        typeRef
      }
    };

    this._commandStack.execute('element.updateProperties', context);
  }

  editCell(cell, text) {
    const context = {
      element: cell,
      properties: {
        text
      }
    };

    this._commandStack.execute('element.updateProperties', context);
  }

  editAnnotation(rule, description) {
    const context = {
      element: rule,
      properties: {
        description
      }
    };

    this._commandStack.execute('element.updateProperties', context);
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

    this._commandStack.execute('element.updateProperties', context);
  }

  claimId(id, moddleElement) {
    const context = {
      id: id,
      element: moddleElement,
      claiming: true
    };

    this._commandStack.execute('id.updateClaim', context);
  }

  unclaimId(id, moddleElement) {
    const context = {
      id: id,
      element: moddleElement
    };

    this._commandStack.execute('id.updateClaim', context);
  }
}

Modeling.$inject = [ 'eventBus', 'elementFactory', 'commandStack', 'sheet' ];