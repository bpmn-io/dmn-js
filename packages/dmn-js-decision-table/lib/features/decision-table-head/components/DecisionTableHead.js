import {
  is,
  getBusinessObject
} from 'dmn-js-shared/lib/util/ModelUtil';

import {
  Component
} from 'inferno';

import {
  ComponentWithSlots
} from 'dmn-js-shared/lib/components/slots';


export default class DecisionTableHead extends ComponentWithSlots {

  constructor(props, context) {
    super(props, context);

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
          inputs.map(input => {
            return this.slotFill({
              type: 'cell',
              context: {
                cellType: 'input-header',
                input
              }
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
              }
            }, DefaultOutputHeaderCell);
          })
        }
      </tr>
      <tr>
        {
          inputs.map((input, index) => {

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
            }, DefaultTypeRefCell);
          })
        }
      </tr>
    </thead>;
  }
}


// default components ///////////////////////

function DefaultInputHeaderCell(props) {

  const {
    input,
    className
  } = props;

  const {
    label,
    inputExpression
  } = input;

  const actualClassName = (className || '') + ' input-cell';

  return (
    <th
      className={ actualClassName }
      key={ input.id }>
      {
        label ? (
          <span className="input-label" title="Input Label">
            { label }
          </span>
        ) : (
          <span className="input-expression" title="Input Expression">
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
          businessObject = root.businessObject,
          colspan = businessObject.input.length;

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


function DefaultOutputHeaderCell(props) {

  const {
    output,
    className
  } = props;

  const {
    label,
    name
  } = output;

  const actualClassName = (className || '') + ' output-cell';

  return (
    <th className={ actualClassName } key={ output.id }>
      {
        label ? (
          <span className="output-label" title="Output Label">
            { label }
          </span>
        ) : (
          <span className="output-name" title="Output Name">
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


function DefaultTypeRefCell(props) {

  const {
    className,
    element
  } = props;

  const actualClassName = className + ' type-ref';

  return (
    <th className={ actualClassName }>
      { element.typeRef }
    </th>
  );
}