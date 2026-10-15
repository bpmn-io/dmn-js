import { Component } from 'inferno';

import ValidatedInput from 'dmn-js-shared/lib/components/ValidatedInput';

import InputSelect from 'dmn-js-shared/lib/components/InputSelect';

import {
  getDateString,
  getSampleDate,
  validateISOString,
  parseString
} from '../Utils';

const EXACT = 'exact',
      BEFORE = 'before',
      AFTER = 'after',
      BETWEEN = 'between';


export default class InputDateEdit extends Component {

  constructor(props, context) {
    super(props, context);

    this._translate = context.injector.get('translate');
    this._modeling = context.injector.get('modeling');

    const { element } = this.props.context;

    const parsedString = parseString(element.businessObject.text);

    if (parsedString) {
      let dates;

      if (parsedString.date) {
        dates = [ parsedString.date, '' ];
      } else if (parsedString.dates) {
        dates = parsedString.dates;
      } else {
        dates = [ '', '' ];
      }

      this.state = {
        type: parsedString.type,
        dates
      };
    } else {
      this.state = {
        type: EXACT,
        dates: [ '', '' ]
      };
    }

    const debounceInput = context.injector.get('debounceInput');

    this.debouncedEditCell = debounceInput(this.editCell.bind(this));
    this.editCell = this.editCell.bind(this);

    this.onTypeChange = this.onTypeChange.bind(this);
    this.onSetStartDateTodayClick = this.onSetStartDateTodayClick.bind(this);
    this.onSetEndDateTodayClick = this.onSetEndDateTodayClick.bind(this);
    this.onStartDateInput = this.onStartDateInput.bind(this);
    this.onEndDateInput = this.onEndDateInput.bind(this);
  }

  editCell(cell, text) {
    this._modeling.editCell(cell, text);
  }

  onTypeChange(value) {
    const { element } = this.props.context;

    const { dates } = this.state;

    this.setState({
      type: value
    });

    if (parseString(getDateString(value, dates))) {
      this.editCell(element.businessObject, getDateString(value, dates));
    }
  }

  onSetStartDateTodayClick() {
    const { element } = this.props.context;

    const { dates, type } = this.state;

    const date = getSampleDate();

    this.setState({
      dates: [ date, dates[1] ]
    });

    if (parseString(getDateString(type, [ date, dates[1] ]))) {
      this.editCell(element.businessObject, getDateString(type, [ date, dates[1] ]));
    }
  }

  onSetEndDateTodayClick() {
    const { element } = this.props.context;

    const { dates, type } = this.state;

    const date = getSampleDate();

    this.setState({
      dates: [ dates[0], date ]
    });

    if (parseString(getDateString(type, [ dates[0], date ]))) {
      this.editCell(element.businessObject, getDateString(type, [ dates[0], date ]));
    }
  }

  onStartDateInput({ value }) {
    const { element } = this.props.context;

    const { dates, type } = this.state;

    this.setState({
      dates: [ value, dates[1] ]
    });

    this.debouncedEditCell(
      element.businessObject,
      getDateString(type, [ value, dates[1] ])
    );
  }

  onEndDateInput({ value }) {
    const { element } = this.props.context;

    const { dates, type } = this.state;

    this.setState({
      dates: [ dates[0], value ]
    });

    this.debouncedEditCell(
      element.businessObject,
      getDateString(type, [ dates[0], value ])
    );
  }

  render() {
    const { dates, type } = this.state;

    const options = [ {
      label: this._translate('Exactly'),
      value: EXACT
    }, {
      label: this._translate('Before'),
      value: BEFORE
    }, {
      label: this._translate('After'),
      value: AFTER
    }, {
      label: this._translate('Between'),
      value: BETWEEN
    } ];

    return (
      <div class="context-menu-container simple-date-edit">

        <h3 class="dms-heading">{ this._translate('Edit date') }</h3>

        <div className="dms-fill-row">
          <InputSelect
            label={ this._translate('Test type') }
            noInput={ true }
            onChange={ this.onTypeChange }
            options={ options }
            value={ type } />
        </div>

        <h4 class="dms-heading">
          {
            type === BETWEEN
              ? this._translate('Edit start date')
              : this._translate('Set date')
          }
        </h4>

        <div>
          <ValidatedInput
            label={
              type === BETWEEN ? this._translate('Start date') : this._translate('Date') }
            className="start-date-input dms-block"
            onInput={ this.onStartDateInput }
            placeholder={ this._translate('e.g. { sample }', {
              sample: getSampleDate()
            }) }
            validate={ string => validateISOString(string) &&
              this._translate(validateISOString(string)) }
            value={ dates[0] } />

          <p className="dms-hint">
            <button type="button"
              className="use-today"
              onClick={ this.onSetStartDateTodayClick }>
              { this._translate('Use today') }
            </button>.
          </p>
        </div>

        {
          type === BETWEEN
            && <h4 class="dms-heading">
              { this._translate('Edit end date') }
            </h4>
        }

        {
          type === BETWEEN
            && <div>
              <ValidatedInput
                label={ this._translate('End date') }
                className="end-date-input dms-block"
                onInput={ this.onEndDateInput }
                placeholder={ this._translate('e.g. { sample }', {
                  sample: getSampleDate()
                }) }
                validate={ string => validateISOString(string) &&
                  this._translate(validateISOString(string)) }
                value={ dates[1] }>
              </ValidatedInput>

              <p className="dms-hint">
                <button type="button"
                  className="use-today"
                  onClick={ this.onSetEndDateTodayClick }>
                  { this._translate('Use today') }
                </button>.
              </p>
            </div>
        }

      </div>
    );
  }
}