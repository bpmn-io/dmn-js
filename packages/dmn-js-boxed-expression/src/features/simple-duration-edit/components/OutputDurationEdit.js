import { Component } from 'inferno';
import { withoutDurationCall } from '../Utils';

import { DurationInput } from './DurationInput';


export default class OutputDurationEdit extends Component {

  constructor(props, context) {
    super(props, context);

    this._translate = context.injector.get('translate');
    this._modeling = context.injector.get('modeling');

    const { element } = this.props.context;

    this._type = getTypeRef(element);

    const debounceInput = context.injector.get('debounceInput');

    this.debouncedEditCell = debounceInput(this.editCell.bind(this));
    this.editCell = this.editCell.bind(this);

    this.onInput = this.onInput.bind(this);
  }

  editCell(cell, text) {
    this._modeling.editCell(cell, text);
  }

  onInput(value) {
    const { element } = this.props.context;

    this.debouncedEditCell(element.businessObject, `duration("${ value }")`);
  }

  render() {
    const value = withoutDurationCall(
      this.props.context.element.businessObject.text, this._type);

    return (
      <div class="context-menu-container simple-duration-edit">

        <h3 class="dms-heading">{ this._translate('Edit duration') }</h3>

        <h4 class="dms-heading">{ this._translate('Set duration') }</h4>

        <DurationInput
          label={ this._translate('Duration value') }
          onInput={ this.onInput }
          value={ value }
          type={ this._type }
          className="dms-block"
        />
      </div>
    );
  }
}

function getTypeRef(element) {
  return element.col.businessObject.typeRef;
}
