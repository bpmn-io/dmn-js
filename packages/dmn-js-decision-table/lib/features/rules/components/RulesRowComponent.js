
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

export default class RulesRowComponent extends Component {

  render({ row, rowIndex, cols }) {
    const { components } = this.context;

    const { cells } = row;

    const beforeComponents =
      components.getComponents('cell', {
        cellType: 'before-rule-cells'
      });

    const afterComponents =
      components.getComponents('cell', {
        cellType: 'after-rule-cells'
      });

    return (
      <tr>
        {
          beforeComponents &&
          beforeComponents.map(Component => <Component { ...this.props } />)
        }
        {
          cells.map((cell, colIndex) => {
            const CellComponent = components.getComponent('cell', { cellType: 'rule' });

            return CellComponent ? <CellComponent
              key={ cell.id }
              rowIndex={ rowIndex }
              cols={ cols }
              colIndex={ colIndex }
              cell={ cell }
            /> : null;
          })
        }
        {
          afterComponents &&
          afterComponents.map(Component => <Component { ...this.props } />)
        }
      </tr>
    );
  }
}