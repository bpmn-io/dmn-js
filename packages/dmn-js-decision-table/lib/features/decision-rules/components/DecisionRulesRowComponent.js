import {
  ComponentWithSlots
} from 'dmn-js-shared/lib/components/slots';


export default class DecisionRulesRowComponent extends ComponentWithSlots {

  render() {

    const {
      row,
      rowIndex
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
              rowIndex,
              row
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
              key: cell.id
            });
          })
        }
        {
          this.slotFills({
            type: 'cell',
            context: {
              cellType: 'after-rule-cells',
              row
            }
          })
        }
      </tr>
    );
  }
}