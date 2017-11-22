
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
            const RulesRowComponent = components.getComponent('row', { rowType: 'rule' });

            return RulesRowComponent && <RulesRowComponent key={ row.id } row={ row } rowIndex={ rowIndex } cols={ cols } />;
          })
        }
      </tbody>
    );
  }
}