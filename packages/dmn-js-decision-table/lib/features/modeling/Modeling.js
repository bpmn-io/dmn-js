import assign from 'lodash/assign';

import BaseModeling from 'table-js/lib/features/modeling/Modeling';

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
    return assign(super._getHandlers(), {
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

  editOutputName(output, name) {
    const context = {
      element: output,
      properties: {
        name
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
}

Modeling.$inject = [ 'eventBus', 'elementFactory', 'commandStack', 'sheet' ];