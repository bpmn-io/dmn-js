import { Component } from 'inferno';

import {
  mixin
} from 'table-js/lib/components';

import {
  ComponentWithSlots
} from 'dmn-js-shared/lib/components/mixins';


export default class DecisionRulesRowComponent extends Component {

  constructor(props, context) {
    super(props, context);

    mixin(this, ComponentWithSlots);
  }

  render() {

    const {
      row,
      rowIndex,
      cols
    } = this.props;

    const {
      cells
    } = row;

    return (
      <tr>
        {
          this.slotFills({
            type: 'cell',
            context: {
              cellType: 'before-rule-cells',
              row,
              rowIndex
            }
          })
        }
        {
          cells.map((cell, colIndex) => {
            return this.slotFill({
              type: 'cell',
              context: {
                cellType: 'rule',
                cell,
                rowIndex: rowIndex,
                colIndex: colIndex
              },
              key: cell.id,
              row,
              col: cols[colIndex]
            });
          })
        }
        {
          this.slotFills({
            type: 'cell',
            context: {
              cellType: 'after-rule-cells',
              row,
              rowIndex
            }
          })
        }
      </tr>
    );
  }
}