
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

export default class AddRuleFootComponent extends Component {
  constructor(props) {
    super(props);

    this.addRule = this.addRule.bind(this);
  }

  componentWillMount() {
    this._eventBus = this.context.injector.get('eventBus');
  }

  addRule() {
    this._eventBus.fire('addRule');
  }

  render({ cols }) {

    const cells = [
      <td
        className="add-rule-add"
        onClick={ this.addRule }>+</td>
    ];

    for (let i = 0; i < cols.length + 1; i++) {
      cells.push(<td className="add-rule" onClick={ this.addRule }>-</td>);
    }

    return (
      <tfoot>
        <tr className="add-rule">
          { cells }
        </tr>
      </tfoot>
    );
  }
}