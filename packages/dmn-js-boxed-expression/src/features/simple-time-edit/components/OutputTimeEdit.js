import { Component } from 'inferno';

import ValidatedInput from 'dmn-js-shared/lib/components/ValidatedInput';

import {
  getSampleTime,
  validateISOString,
  parseString
} from '../Utils';
import { getSampleDate } from '../../simple-date-edit/Utils';


export default class OutputTimeEdit extends Component {

  constructor(props, context) {
    super(props, context);

    this._translate = context.injector.get('translate');
    this._modeling = context.injector.get('modeling');

    const { element } = this.props.context;

    const parsedString = parseString(element.businessObject.text);

    this.state = {
      date: parsedString ? parsedString.date : ''
    };

    const debounceInput = context.injector.get('debounceInput');

    this.debouncedEditCell = debounceInput(this.editCell.bind(this));
    this.editCell = this.editCell.bind(this);

    this.onClick = this.onClick.bind(this);
    this.onInput = this.onInput.bind(this);
  }

  editCell(cell, text) {
    this._modeling.editCell(cell, text);
  }

  onClick() {
    const { element } = this.props.context;

    const date = getSampleTime();

    this.setState({
      date
    });

    this.editCell(element.businessObject, `time("${ date }")`);
  }

  onInput({ value }) {
    const { element } = this.props.context;

    this.setState({
      date: value
    });

    this.debouncedEditCell(element.businessObject, `time("${ value }")`);
  }

  render() {
    const { date } = this.state;

    return (
      <div class="context-menu-container simple-time-edit">

        <h3 class="dms-heading">{ this._translate('Edit time') }</h3>

        <h4 class="dms-heading">{ this._translate('Set time') }</h4>

        <div>
          <ValidatedInput
            label={ this._translate('Time value') }
            onInput={ this.onInput }
            placeholder={ this._translate('e.g. { example } ', {
              example: getSampleDate()
            }) }
            validate={ string => validateISOString(string) &&
              this._translate(validateISOString(string)) }
            value={ date }
            className="dms-block">
          </ValidatedInput>

          <p className="dms-hint">
            <button type="button"
              className="use-now"
              onClick={ this.onClick }>{ this._translate('Use now') }</button>.
          </p>
        </div>

      </div>
    );
  }
}