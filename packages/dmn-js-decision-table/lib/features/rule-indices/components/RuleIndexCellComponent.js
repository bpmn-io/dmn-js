
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

export default class RulesIndexCellComponent extends Component {
  render() {
    const { rowIndex } = this.props;

    return <td className="rule-index">{rowIndex + 1}</td>;
  }
}