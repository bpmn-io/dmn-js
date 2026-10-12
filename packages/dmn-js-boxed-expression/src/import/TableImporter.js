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
    this._sheet = sheet;

    // decision table -> root
    this._roots = new Map();

    // the root which is imported at the moment
    this._root = null;

    eventBus.on('table.clear', () => {
      this._roots.clear();
      this._root = null;
    });

    eventBus.on('sheet.rootRemoved', ({ root }) => {
      this._roots.delete(root.businessObject);
    });
  }

  /**
   * Return the root of a decision table that has been imported.
   *
   * @param {ModdleElement} table
   *
   * @return {Root|undefined}
   */
  getRoot(table) {
    return this._roots.get(table);
  }

  /**
   * Add DMN element.
   */
  add(semantic) {
    let element;

    // decision table
    if (is(semantic, 'dmn:DecisionTable')) {
      element = this._elementFactory.createRoot(elementData(semantic));

      // the first table is the primary root
      if (this._roots.size) {
        this._sheet.addRoot(element);
      } else {
        this._sheet.setRoot(element);
      }

      this._roots.set(semantic, element);

      this._root = element;
    }

    // input clause
    else if (is(semantic, 'dmn:InputClause')) {
      element = this._elementFactory.createCol(elementData(semantic));

      this._sheet.addCol(element, undefined, this._root);
    }

    // output clause
    else if (is(semantic, 'dmn:OutputClause')) {
      element = this._elementFactory.createCol(elementData(semantic));

      this._sheet.addCol(element, undefined, this._root);
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

      this._sheet.addRow(element, undefined, this._root);
    }

    return element;
  }
}

TableImporter.$inject = [ 'elementFactory', 'eventBus', 'sheet' ];