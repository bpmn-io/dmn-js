import { Component } from 'inferno';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';


export default class DecisionRulesCellComponent extends Component {
  render() {
    const { cell } = this.props;

    if (is(cell, 'dmn:UnaryTests')) {
      return (
        <td className="input-cell" data-element-id={ cell.id }>
          { cell.businessObject.text }
        </td>
      );
    } else {
      return (
        <td className="output-cell" data-element-id={ cell.id }>
          { cell.businessObject.text }
        </td>
      );
    }
  }
}