
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

export default class RulesBodyComponent extends Component {
  render({ rows, cols }) {
    const { components } = this.context;

    return (
      <tbody>
        {
          rows.map((row, rowIndex) => {
            const RowComponent = components.getComponent('row', { rowType: 'rule' });

            return (
              RowComponent &&
              <RowComponent
                key={ row.id }
                row={ row }
                rowIndex={ rowIndex }
                cols={ cols } />
            );
          })
        }
      </tbody>
    );
  }
}