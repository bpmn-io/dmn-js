
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

export default class RulesCellComponent extends Component {
  render() {
    const { cell } = this.props;

    if (is(cell, 'dmn:UnaryTests')) {
      return <td className="input">{ cell.businessObject.text }</td>;
    } else {
      return <td className="output">{ cell.businessObject.text }</td>;
    }
  }
}