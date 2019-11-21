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

  componentWillUnmout() {
    const root = this._sheet.getRoot();

    this._changeSupport.offElementsChanged(root.id, this.onElementsChanged);
  }

  render(props) {
    const root = this._sheet.getRoot();

    if (!is(root, 'dmn:DMNElement')) {
      return null;
    }

    const businessObject = getBusinessObject(root);

    const inputs = businessObject.input,
          outputs = businessObject.output;

    return <thead>
      <tr>

        {
          this.slotFills({
            type: 'cell',
            context: { cellType: 'before-label-cells' }
          })
        }

        {
          this.slotFill({
            type: 'cell',
            context: { cellType: 'input-label' }
          }, DefaultInputLabel)
        }

        {
          this.slotFill({
            type: 'cell',
            context: { cellType: 'output-label' }
          }, DefaultOutputLabel)
        }

        {
          this.slotFills({
            type: 'cell',
            context: { cellType: 'after-label-cells' }
          })
        }
      </tr>
      <tr>
        {
          inputs && inputs.map(input => {
            return this.slotFill({
              type: 'cell',
              context: {
                cellType: 'input-header',
                input
              },
              key: input.id
            }, DefaultInputHeaderCell);
          })
        }
        {
          outputs.map(output => {
            return this.slotFill({
              type: 'cell',
              context: {
                cellType: 'output-header',
                output
              },
              key: output.id
            }, DefaultOutputHeaderCell);
          })
        }
      </tr>
      <tr>
        {
          inputs && inputs.map((input, index) => {

            const {
              inputExpression
            } = input;

            return this.slotFill({
              type: 'cell',
              context: {
                cellType: 'input-header-type-ref',
                element: inputExpression
              },
              className: 'input-cell',
              key: input.id
            }, DefaultTypeRefCell);
          })
        }
        {
          outputs.map(output => {

            return this.slotFill({
              type: 'cell',
              context: {
                cellType: 'output-header-type-ref',
                element: output
              },
              className: 'output-cell',
              key: output.id
            }, DefaultTypeRefCell);
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
    className
  } = props;

  const {
    label,
    inputExpression
  } = input;

  const translate = context.injector.get('translate');

  const actualClassName = (className || '') + ' input-cell';

  return (
    <th
      data-col-id={ input.id }
      className={ actualClassName }
      key={ input.id }>
      {
        label ? (
          <span className="input-label" title={ translate('Input Label') }>
            { label }
          </span>
        ) : (
          <span className="input-expression" title={ translate('Input Expression') }>
            { inputExpression.text || '-' }
          </span>
        )
      }
    </th>
  );
}


class DefaultInputLabel extends Component {

  constructor(props, context) {
    super(props, context);

    this._sheet = context.injector.get('sheet');
  }

  render() {

    const root = this._sheet.getRoot(),
          businessObject = root.businessObject;

    const inputs = businessObject.input;

    if (!inputs || !inputs.length) {
      return null;
    }

    const colspan = businessObject.input.length;

    return (
      <th
        className="input-cell inputs-label header"
        colspan={ colspan }
      >
        Input
      </th>
    );
  }

}


function DefaultOutputHeaderCell(props, context) {

  const {
    output,
    className
  } = props;

  const {
    label,
    name
  } = output;

  const translate = context.injector.get('translate');

  const actualClassName = (className || '') + ' output-cell';

  return (
    <th className={ actualClassName } key={ output.id }>
      {
        label ? (
          <span className="output-label" title={ translate('Output Label') }>
            { label }
          </span>
        ) : (
          <span className="output-name" title={ translate('Output Name') }>
            { name || '-' }
          </span>
        )
      }
    </th>
  );
}



class DefaultOutputLabel extends Component {

  constructor(props, context) {
    super(props, context);

    this._sheet = context.injector.get('sheet');
  }

  render() {
    const root = this._sheet.getRoot(),
          businessObject = root.businessObject,
          colspan = businessObject.output.length;

    return (
      <th
        className="output-cell outputs-label header"
        colspan={ colspan }
      >
        Output
      </th>
    );
  }

}


function DefaultTypeRefCell(props, context) {

  const {
    className,
    element
  } = props;

  const translate = context.injector.get('translate');

  const actualClassName = className + ' type-ref';

  return (
    <th className={ actualClassName } title={ translate('Data Type') }>
      { element.typeRef }
    </th>
  );
}