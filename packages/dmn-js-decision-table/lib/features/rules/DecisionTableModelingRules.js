import { isArray } from 'min-dash/lib/lang';
import { every } from 'min-dash/lib/collection';

import { Row, Col } from 'table-js/lib/model';

import { is, isInput, isOutput } from 'dmn-js-shared/lib/util/ModelUtil';

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';

const HIGH_PRIORITY = 2000;

export default class DecisionTableModelingRules extends RuleProvider {
  constructor(eventBus, sheet) {
    super(eventBus);

    this._sheet = sheet;
  }

  init() {
    this.addRule('col.remove', HIGH_PRIORITY, ({ col }) => {
      const { cols } = this._sheet.getRoot();

      if (isInput(col)) {
        return cols.filter(c => isInput(c)).length > 1;
      } else {
        return cols.filter(c => isOutput(c)).length > 1;
      }
    });

    this.addRule('paste', HIGH_PRIORITY, ({ elements, target }) => {
      if (!elements || !target) {
        return false;
      }

      if (!isArray(elements)) {
        elements = [ elements ];
      }

      if (target instanceof Row) {
        return this.canPasteRows(elements);
      } else if (target instanceof Col) {
        return this.canPasteCols(elements, target);
      }
    });
  }

  canPasteRows(rows) {
    const { cols } = this._sheet.getRoot();

    return every(rows, row => {
      if (!(row instanceof Row)) {
        return false;
      }

      if (row.cells.length !== cols.length) {
        return false;
      }

      return every(row.cells, (cell, index) => {
        if (isInput(cols[index])) {
          return is(cell, 'dmn:UnaryTests');
        } else {
          return is(cell, 'dmn:LiteralExpression');
        }
      });

    });
  }

  canPasteCols(cols, targetCol) {
    const { rows } = this._sheet.getRoot();

    return every(cols, col => {
      if (col.cells.length !== rows.length) {
        return false;
      }

      if (isInput(targetCol)) {
        return isInput(col);
      } else {
        return isOutput(col);
      }
    });
  }
}

DecisionTableModelingRules.$inject = [ 'eventBus', 'sheet' ];