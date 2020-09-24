import { Component } from 'inferno';

import {
  mixin
} from 'table-js/lib/components';

import {
  ComponentWithSlots
} from 'dmn-js-shared/lib/components/mixins';


export default class InputCell extends Component {

  constructor(props, context) {
    super(props, context);

    mixin(this, ComponentWithSlots);

    this._translate = context.injector.get('translate');
  }

  onClick = (event) => {
    const { input } = this.props;

    this._eventBus.fire('input.edit', {
      event,
      input
    });
  }

  onContextmenu = (event) => {
    const { id } = this.props.input;

    this._eventBus.fire('cell.contextmenu', {
      event,
      id
    });
  }

  onElementsChanged = () => {
    this.forceUpdate();
  }

  componentWillMount() {
    const { injector } = this.context;

    this._changeSupport = this.context.changeSupport;
    this._sheet = injector.get('sheet');
    this._eventBus = injector.get('eventBus');
    this._elementRegistry = injector.get('elementRegistry');

    const root = this._sheet.getRoot();

    const { input } = this.props;

    this._changeSupport.onElementsChanged(root.id, this.onElementsChanged);
    this._changeSupport.onElementsChanged(input.id, this.onElementsChanged);
  }

  componentWillUnmount() {
    const root = this._sheet.getRoot();

    const { input } = this.props;

    this._changeSupport.offElementsChanged(root.id, this.onElementsChanged);
    this._changeSupport.offElementsChanged(input.id, this.onElementsChanged);
  }

  render() {
    const {
      input,
      index,
      inputsLength
    } = this.props;

    const {
      inputExpression,
      inputValues
    } = input;

    const label = input.get('label');

    const width = input.width ? input.width + 'px' : '192px';

    return (
      <th
        data-col-id={ input.id }
        onDoubleClick={ this.onClick }
        onContextmenu={ this.onContextmenu }
        className="input-cell input-editor"
        style={ { width } }
      >

        {
          this.slotFills({
            type: 'cell-inner',
            context: {
              cellType: 'input-cell',
              col: this._elementRegistry.get(input.id),
              index,
              inputsLength
            },
            col: input
          })
        }

        <div className="clause">
          { index === 0 ? this._translate('When') : this._translate('And') }
        </div>

        {
          label ? (
            <div className="input-label" title={ this._translate('Input Label') }>
              { label }
            </div>
          ) : (
            <div
              className="input-expression"
              title={ this._translate('Input Expression') }>
              { inputExpression.text }
            </div>
          )
        }

        <div
          className="input-variable"
          title={
            inputValues && inputValues.text ? this._translate('Input Values') :
              this._translate('Input Type')
          }
        >
          { inputValues && inputValues.text || inputExpression.typeRef }
        </div>
      </th>
    );
  }

}