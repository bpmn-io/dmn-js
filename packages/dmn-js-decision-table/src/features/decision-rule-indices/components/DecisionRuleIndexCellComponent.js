import { Component } from 'inferno';


export default class DecisionRulesIndexCellComponent extends Component {
  render() {
    const { row, rowIndex } = this.props;

    const { components } = this.context;

    const innerComponents = components.getComponents(
      'cell-inner',
      {
        cellType: 'rule-index',
        row,
        rowIndex
      }
    );

    return <td className="rule-index" data-element-id={ row.id } data-row-id={ row.id }>
      {
        innerComponents
          && innerComponents.map(InnerComponent => {
            return <InnerComponent
              row={ row }
              rowIndex={ rowIndex } />;
          })
      }
      { rowIndex + 1 }
    </td>;
  }
}