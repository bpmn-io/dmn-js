import { Component } from 'inferno';

import {
  mixin
} from 'table-js/lib/components';

import {
  ComponentWithSlots
} from 'dmn-js-shared/lib/components/mixins';


export default class OutputCell extends Component {

  constructor(props, context) {
    super(props, context);

    mixin(this, ComponentWithSlots);

    this._translate = context.injector.get('translate');
  }

  onClick = (event) => {
    const { output } = this.props;

    this._eventBus.fire('output.edit', {
      event,
      output
    });
  };

  onContextmenu = (event) => {
    const { id } = this.props.output;

    this._eventBus.fire('cell.contextmenu', {
      event,
      id
    });
  };

  onElementsChanged = () => {
    this.forceUpdate();
  };

  componentWillMount() {
    const { injector } = this.context;

    this._changeSupport = this.context.changeSupport;
    this._eventBus = injector.get('eventBus');
    this._elementRegistry = injector.get('elementRegistry');

    const { output } = this.props;

    this._changeSupport.onElementsChanged(output.id, this.onElementsChanged);
  }

  componentWillUnmount() {
    const { output } = this.props;

    this._changeSupport.offElementsChanged(output.id, this.onElementsChanged);
  }

  render() {
    const {
      output,
      index,
      outputsLength
    } = this.props;

    const {
      label,
      name,
      outputValues,
      typeRef
    } = output;

    const width = output.width ? output.width + 'px' : '192px';

    return (
      <th
        data-col-id={ output.id }
        onDoubleClick={ this.onClick }
        onContextMenu={ this.onContextmenu }
        className="output-cell output-editor"
        style={ { width } }
      >

        {
          this.slotFills({
            type: 'cell-inner',
            context: {
              cellType: 'output-cell',
              col: this._elementRegistry.get(output.id),
              index,
              outputsLength
            },
            col: output
          })
        }

        <div className="clause">
          { index === 0 ? this._translate('Then') : this._translate('And') }
        </div>

        {
          label ? (
            <div
              className="output-label"
              title={ this._translate('Output label: ') + label }>
              { label }
            </div>
          ) : (
            <div
              className="output-name"
              title={ this._translate('Output name: ') + name }>
              { name }
            </div>
          )
        }

        <div
          className="output-variable"
          title={
            outputValues && outputValues.text ? this._translate('Output values') :
              this._translate('Output type')
          }
        >
          { outputValues && outputValues.text || this._translate(typeRef || '') }
        </div>
      </th>
    );
  }

}