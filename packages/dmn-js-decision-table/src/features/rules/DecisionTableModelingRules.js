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

      if (isOutput(col)) {
        return cols.filter(c => isOutput(c)).length > 1;
      }

      return true;
    });

    // a rule that is aware of the data structure coming from copy and paste
    this.addRule('paste', HIGH_PRIORITY, ({ data, target }) => {
      if (!data || !target) {
        return false;
      }

      const { root } = data;

      if (target instanceof Row) {
        return this.canPasteRows(root);
      }

      if (target instanceof Col) {
        return this.canPasteCols(root, target);
      }

      return false;
    });
  }

  canPasteRows(root) {
    const { cols } = this._sheet.getRoot();

    return every(root, descriptor => {
      if (descriptor.type !== 'row') {
        return false;
      }

      if (descriptor.cells.length !== cols.length) {
        return false;
      }

      return every(descriptor.cells, (cellDescriptor, index) => {
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

    return every(root, descriptor => {
      if (descriptor.type !== 'col') {
        return false;
      }

      if (descriptor.cells.length !== rows.length) {
        return false;
      }

      if (isInput(targetCol)) {
        return descriptor.businessObject.$type === 'dmn:InputClause';
      } else {
        return descriptor.businessObject.$type === 'dmn:OutputClause';
      }
    });
  }
}

DecisionTableModelingRules.$inject = [ 'eventBus', 'sheet' ];