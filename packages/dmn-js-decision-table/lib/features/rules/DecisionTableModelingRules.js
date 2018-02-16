import {
  every
} from 'min-dash';

import { Row, Col } from 'table-js/lib/model';

import { isInput, isOutput } from 'dmn-js-shared/lib/util/ModelUtil';

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';

const HIGH_PRIORITY = 2000;

export default class DecisionTableModelingRules extends RuleProvider {
  constructor(eventBus, sheet) {
    super(eventBus);

    this._sheet = sheet;
  }

  init() {
    this.addRule('col.move', HIGH_PRIORITY, ({ col, index }) => {
      const { businessObject } = this._sheet.getRoot(),
            { input } = businessObject;

      if (isInput(col)) {
        return index < input.length;
      } else {
        return index >= input.length;
      }
    });

    this.addRule('col.remove', HIGH_PRIORITY, ({ col }) => {
      const { cols } = this._sheet.getRoot();

      if (isInput(col)) {
        return cols.filter(c => isInput(c)).length > 1;
      } else {
        return cols.filter(c => isOutput(c)).length > 1;
      }
    });

    // a rule that is aware of the data structure coming from copy and paste
    this.addRule('paste', HIGH_PRIORITY, ({ data, target }) => {
      if (!data || !target) {
        return false;
      }

      const { root } = data;

      if (target instanceof Row) {
        return this.canPasteRows(root);
      } else if (target instanceof Col) {
        return this.canPasteCols(root, target);
      }
    });
  }

  canPasteRows(root) {
    const { cols } = this._sheet.getRoot();

    return every(root, rowDescriptor => {
      if (rowDescriptor.type !== 'row') {
        return false;
      }

      if (rowDescriptor.cells.length !== cols.length) {
        return false;
      }

      return every(rowDescriptor.cells, (cellDescriptor, index) => {
        if (isInput(cols[index])) {
          return cellDescriptor.businessObject.$type === 'dmn:UnaryTests';
        } else {
          return cellDescriptor.businessObject.$type === 'dmn:LiteralExpression';
        }
      });

    });
  }

  canPasteCols(root, targetCol) {
    const { rows } = this._sheet.getRoot();

    return every(root, colDescriptor => {
      if (colDescriptor.cells.length !== rows.length) {
        return false;
      }

      if (isInput(targetCol)) {
        return colDescriptor.businessObject.$type === 'dmn:InputClause';
      } else {
        return colDescriptor.businessObject.$type === 'dmn:OutputClause';
      }
    });
  }
}

DecisionTableModelingRules.$inject = [ 'eventBus', 'sheet' ];