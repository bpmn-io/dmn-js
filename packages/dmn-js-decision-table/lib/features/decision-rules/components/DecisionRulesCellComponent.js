import { Component } from 'inferno';

import { Cell } from 'table-js/lib/components';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';


export default class DecisionRulesCellComponent extends Component {
  render() {
    const { cell, row, col } = this.props;

    if (is(cell, 'dmn:UnaryTests')) {
      return (
        <Cell
          className="input-cell"
          elementId={ cell.id }
          data-row-id={ row.id }
          data-col-id={ col.id }>
          { cell.businessObject.text }
        </Cell>
      );
    } else {
      return (
        <Cell
          className="output-cell"
          elementId={ cell.id }
          data-row-id={ row.id }
          data-col-id={ col.id }>
          { cell.businessObject.text }
        </Cell>
      );
    }
  }
}