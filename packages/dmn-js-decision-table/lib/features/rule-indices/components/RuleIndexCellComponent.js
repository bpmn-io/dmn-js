import { Component } from 'inferno';


export default class RulesIndexCellComponent extends Component {
  render() {
    const { rowIndex } = this.props;

    return <td className="rule-index">{rowIndex + 1}</td>;
  }
}