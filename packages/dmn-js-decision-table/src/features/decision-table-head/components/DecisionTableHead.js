import {
  is,
  getBusinessObject
} from 'dmn-js-shared/lib/util/ModelUtil';

import { Component } from 'inferno';

import {
  mixin
} from 'table-js/lib/components';

import {
  ComponentWithSlots
} from 'dmn-js-shared/lib/components/mixins';


export default class DecisionTableHead extends Component {

  constructor(props, context) {
    super(props, context);

    mixin(this, ComponentWithSlots);

    this._sheet = context.injector.get('sheet');

    this._changeSupport = context.changeSupport;
  }

  onElementsChanged = () => {
    this.forceUpdate();
  }

  componentWillMount() {
    const root = this._sheet.getRoot();

    this._changeSupport.onElementsChanged(root.id, this.onElementsChanged);
  }

  componentWillUnmount() {
    const root = this._sheet.getRoot();

    this._changeSupport.offElementsChanged(root.id, this.onElementsChanged);
  }

  render() {
    const root = this._sheet.getRoot();

    if (!is(root, 'dmn:DMNElement')) {
      return null;
    }

    const businessObject = getBusinessObject(root);

    const inputs = businessObject.input,
          outputs = businessObject.output;

    return <thead>
      <tr>
        <th
          className="index-column"
        />

        {
          this.slotFills({
            type: 'cell',
            context: { cellType: 'before-label-cells' }
          })
        }

        {
          inputs && inputs.map((input, index) => {
            const width = input.width || '192px';

            return this.slotFill({
              type: 'cell',
              context: {
                cellType: 'input-header',
                input,
                index,
                inputsLength: inputs.length,
                width
              },
              key: input.id
            }, DefaultInputHeaderCell);
          })
        }
        {
          outputs.map((output, index) => {
            return this.slotFill({
              type: 'cell',
              context: {
                cellType: 'output-header',
                output,
                index,
                outputsLength: outputs.length
              },
              key: output.id
            }, DefaultOutputHeaderCell);
          })
        }

        {
          this.slotFills({
            type: 'cell',
            context: { cellType: 'after-label-cells' }
          })
        }
      </tr>
    </thead>;
  }
}


// default components ///////////////////////

function DefaultInputHeaderCell(props, context) {

  const {
    input,
    className,
    index
  } = props;

  const {
    label,
    inputExpression,
    inputValues
  } = input;

  const translate = context.injector.get('translate');

  const actualClassName = (className || '') + ' input-cell';

  return (
    <th
      data-col-id={ input.id }
      className={ actualClassName }
      key={ input.id }>

      <div className="clause">
        { index === 0 ? translate('When') : translate('And') }
      </div>

      {
        label ? (
          <div className="input-label" title={ translate('Input Label') }>
            { label }
          </div>
        ) : (
          <div
            className="input-expression"
            title={ translate('Input Expression') }>
            { inputExpression.text }
          </div>
        )
      }

      <div
        className="input-variable"
        title={
          inputValues && inputValues.text ? translate('Input Values') :
            translate('Input Type')
        }
      >
        { inputValues && inputValues.text || inputExpression.typeRef }
      </div>
    </th>
  );
}


function DefaultOutputHeaderCell(props, context) {

  const {
    output,
    className,
    index
  } = props;

  const {
    label,
    name,
    outputValues,
    typeRef
  } = output;

  const translate = context.injector.get('translate');

  const actualClassName = (className || '') + ' output-cell';

  return (
    <th className={ actualClassName } key={ output.id }>

      <div className="clause">
        { index === 0 ? translate('Then') : translate('And') }
      </div>

      {
        label ? (
          <div className="output-label" title={ translate('Output Label') }>
            { label }
          </div>
        ) : (
          <div
            className="output-name"
            title={ translate('Output Name') }>
            { name }
          </div>
        )
      }

      <div
        className="output-variable"
        title={
          outputValues && outputValues.text ? translate('Output Values') :
            translate('Output Type')
        }
      >
        { outputValues && outputValues.text || typeRef }
      </div>
    </th>
  );
}
