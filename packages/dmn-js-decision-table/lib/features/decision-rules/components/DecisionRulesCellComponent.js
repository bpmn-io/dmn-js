import { Component } from 'inferno';

import { Cell } from 'table-js/lib/components';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';


export default class DecisionRulesCellComponent extends Component {
  render() {
    const { cell } = this.props;

    if (is(cell, 'dmn:UnaryTests')) {
      return (
        <Cell className="input-cell" elementId={ cell.id }>
          { cell.businessObject.text }
        </Cell>
      );
    } else {
      return (
        <Cell className="output-cell" elementId={ cell.id }>
          { cell.businessObject.text }
        </Cell>
      );
    }
  }
}