import { assign } from 'min-dash';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

function elementData(semantic, attrs) {
  return assign({
    id: semantic.id,
    type: semantic.$type,
    businessObject: semantic
  }, attrs);
}

export default class TableImporter {

  constructor(elementFactory, eventBus, sheet) {
    this._elementFactory = elementFactory;
    this._eventBus = eventBus;
    this._sheet = sheet;
  }

  /**
   * Add DMN element.
   */
  add(semantic) {
    let element;

    // decision table
    if (is(semantic, 'dmn:DecisionTable')) {
      element = this._elementFactory.createRoot(elementData(semantic));

      this._sheet.setRoot(element);
    }

    // input clause
    else if (is(semantic, 'dmn:InputClause')) {
      element = this._elementFactory.createCol(elementData(semantic));

      this._sheet.addCol(element);
    }

    // output clause
    else if (is(semantic, 'dmn:OutputClause')) {
      element = this._elementFactory.createCol(elementData(semantic));

      this._sheet.addCol(element);
    }

    // rule
    else if (is(semantic, 'dmn:DecisionRule')) {
      if (!semantic.inputEntry) {
        semantic.inputEntry = [];
      }

      if (!semantic.outputEntry) {
        semantic.outputEntry = [];
      }

      const cells = [
        ...semantic.inputEntry,
        ...semantic.outputEntry
      ].map((entry) => {
        return this._elementFactory.createCell(elementData(entry));
      });

      element = this._elementFactory.createRow(assign(elementData(semantic), {
        cells
      }));

      this._sheet.addRow(element);
    }

    this._eventBus.fire('dmnElement.added', { element: element });

    return element;
  }
}

TableImporter.$inject = [ 'elementFactory', 'eventBus', 'sheet' ];