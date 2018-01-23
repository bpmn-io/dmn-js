
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

import {
  is,
  getBusinessObject
} from 'dmn-js-shared/lib/util/ModelUtil';


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

    this._changeSupport.offElementsChanged(root.id, this.onElementsChanged);
  }

  render(props) {

    const { components } = this.context;

    const root = this._sheet.getRoot();

    if (!is(root, 'dmn:DMNElement')) {
      return null;
    }

    const businessObject = getBusinessObject(root);

    const inputs = businessObject.input,
          outputs = businessObject.output;

    const InputLabelCellComponent = components.getComponent(
      'cell',
      { cellType: 'input-label' }
    );
    const OutputLabelComponent = components.getComponent(
      'cell',
      { cellType: 'output-label' }
    );

    const beforeComponents = components.getComponents(
      'cell',
      { cellType: 'before-label-cells' }
    );
    const afterComponents = components.getComponents(
      'cell',
      { cellType: 'after-label-cells' }
    );

    return <thead>
      <tr>
        { beforeComponents && beforeComponents.map(Component => <Component />) }
        { InputLabelCellComponent && <InputLabelCellComponent /> }
        { OutputLabelComponent && <OutputLabelComponent /> }
        { afterComponents && afterComponents.map(Component => <Component />) }
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
              return (
                <th className="input input-expression">
                  { inputExpression.text || '-' }
                </th>
              );
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
          inputs.map(input => {
            const { inputExpression } = input;

            const InputExpressionTypeRefComponent = components.getComponent('cell', {
              cellType: 'input-expression-type-ref',
              inputExpression
            });

            if (InputExpressionTypeRefComponent) {
              return (
                <InputExpressionTypeRefComponent
                  inputExpression={ inputExpression } />
              );
            } else {
              return <th className="input type-ref">{ inputExpression.typeRef }</th>;
            }
          })
        }
        {
          outputs.map(output => {
            const { typeRef } = output;

            const OutputTypeRefComponent = components.getComponent('cell', {
              cellType: 'output-type-ref',
              output
            });

            if (OutputTypeRefComponent) {
              return <OutputTypeRefComponent output={ output } />;
            } else {
              return <th className="output type-ref">{ typeRef }</th>;
            }
          })
        }
      </tr>
    </thead>;
  }
}