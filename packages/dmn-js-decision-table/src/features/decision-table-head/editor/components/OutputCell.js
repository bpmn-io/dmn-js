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
  }

  onContextmenu = (event) => {
    const { id } = this.props.output;

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
    const output = this.props.output;

    var label = output.get('label');
    var name = output.get('name');

    return (
      <th
        data-col-id={ output.id }
        onClick={ this.onClick }
        onContextmenu={ this.onContextmenu }
        className="output-cell output-editor">

        {
          this.slotFills({
            type: 'cell-inner',
            context: {
              cellType: 'output-cell',
              col: this._elementRegistry.get(output.id)
            },
            col: output
          })
        }

        {
          label ? (
            <span className="output-label" title={ this._translate('Output Label') }>
              { label }
            </span>
          ) : (
            <span className="output-name" title={ this._translate('Output Expression') }>
              { name || '-' }
            </span>
          )
        }
      </th>
    );
  }

}