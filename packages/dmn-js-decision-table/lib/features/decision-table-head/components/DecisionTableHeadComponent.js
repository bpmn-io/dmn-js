
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

import { getBusinessObject } from '../../../util/ModelUtil';

export default class DecisionTableHeadComponent extends Component {

  constructor(props) {
    super(props);

    this.onElementsChanged = this.onElementsChanged.bind(this);
  }

  onElementsChanged() {
    this.forceUpdate();
  }

  componentWillMount() {
    const { injector } = this.context;

    const changeSupport = this._changeSupport = this.context.changeSupport;
    this._sheet = injector.get('sheet');

    const root = this._sheet.getRoot();

    changeSupport.onElementsChanged(root.id, this.onElementsChanged);
  }
  
  componentWillUnmout() {
    const root = this._sheet.getRoot();

    this._changeSupport.onElementsChanged(root.id, this.onElementsChanged);
  }

  render(props) {
    const { components } = this.context;

    const root = this._sheet.getRoot(),
          businessObject = getBusinessObject(root);

    const inputs = businessObject.input,
          outputs = businessObject.output;

    const InputLabelCellComponent = components.getComponent('cell', { cellType: 'input-label' });
    const OutputLabelComponent = components.getComponent('cell', { cellType: 'output-label' });

    const beforeLabelCellsComponents = components.getComponents('cell', { cellType: 'before-label-cells' });
    const afterLabelCellsComponents = components.getComponents('cell', { cellType: 'after-label-cells' });

    return <thead>
      <tr>
        { beforeLabelCellsComponents && beforeLabelCellsComponents.map(Component => <Component />) }
        { InputLabelCellComponent && <InputLabelCellComponent /> }
        { OutputLabelComponent && <OutputLabelComponent /> }
        { afterLabelCellsComponents && afterLabelCellsComponents.map(Component => <Component />) }
      </tr>
      <tr>
        {
          inputs.map(input => {
            const { inputExpression } = input;

            const InputExpressionComponent = components.getComponent('cell', {
              cellType: 'input-expression',
              inputExpression
            });

            if (InputExpressionComponent) {
              return <InputExpressionComponent input={ input } />;
            } else {
              return <th className="input input-expression">{ inputExpression.text || '-' }</th>;
            }
          })
        }
        {
          outputs.map(output => {
            const { name } = output;

            const OutputNameComponent = components.getComponent('cell', {
              cellType: 'output-name',
              output
            });

            if (OutputNameComponent) {
              return <OutputNameComponent output={ output } />;
            } else {
              return <th className="output output-name">{ name || '-' }</th>;
            }
          })
        }
      </tr>
      <tr>
        {
          inputs.map(({ id, inputExpression }) => {
            return (
              <th className="input type-ref">{ inputExpression.typeRef }</th>
            );
          })
        }
        {
          outputs.map(({ id, typeRef }) => {
            return (
              <th className="output type-ref">{ typeRef }</th>
            );
          })
        }
      </tr>
    </thead>;
  }
}