import { Component } from 'inferno';

import InputSelect from 'dmn-js-shared/lib/components/InputSelect';

import { parseString } from '../Utils';

const TRUE = 'true',
      FALSE = 'false',
      NONE = 'none';


export default class BooleanEdit extends Component {

  constructor(props, context) {
    super(props, context);

    this._translate = context.injector.get('translate');
    this._modeling = context.injector.get('modeling');

    const { element } = this.props.context;

    const parsedString = parseString(element.businessObject.text);

    this.state = {
      value: parsedString || NONE
    };

    this.editCell = this.editCell.bind(this);

    this.onChange = this.onChange.bind(this);
  }

  editCell(cell, text) {
    this._modeling.editCell(cell, text);
  }

  onChange(value) {
    const { element } = this.props.context;

    this.editCell(element.businessObject, value === NONE ? '' : value);

    this.setState({
      value
    });
  }

  render() {
    const { value } = this.state;

    const options = [ {
      label: '-',
      value: NONE
    }, {
      label: this._translate('Yes'),
      value: TRUE
    }, {
      label: this._translate('No'),
      value: FALSE
    } ];

    return (
      <div class="simple-boolean-edit context-menu-container">

        <h3 class="dms-heading">{this._translate('Edit boolean')}</h3>

        <h4 class="dms-heading">{this._translate('Set value')}</h4>

        <InputSelect
          label={ this._translate('Boolean value') }
          noInput={ true }
          className="dms-block"
          onChange={ this.onChange }
          options={ options }
          value={ value } />

      </div>
    );
  }
}