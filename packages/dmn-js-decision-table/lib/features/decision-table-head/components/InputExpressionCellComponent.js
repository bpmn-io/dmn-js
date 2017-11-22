
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

export default class InputExpressionCellComponent extends Component {

  render() {
    const { inputExpression } = this.props.input;
    
    return <th className="input input-expression">{ inputExpression.text || '-' }</th>;
  }

}