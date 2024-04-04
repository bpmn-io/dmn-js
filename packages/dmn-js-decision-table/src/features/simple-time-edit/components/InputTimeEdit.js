import { Component } from 'inferno';

import ValidatedInput from 'dmn-js-shared/lib/components/ValidatedInput';

import InputSelect from 'dmn-js-shared/lib/components/InputSelect';

import {
  getTimeString,
  getSampleTime,
  validateISOString,
  parseString
} from '../Utils';
import { getSampleDate } from '../../simple-date-edit/Utils';

const EXACT = 'exact',
      BEFORE = 'before',
      AFTER = 'after',
      BETWEEN = 'between';


export default class InputTimeEdit extends Component {

  constructor(props, context) {
    super(props, context);

    this._translate = context.injector.get('translate');
    this._modeling = context.injector.get('modeling');

    const { element } = this.props.context;

    const parsedString = parseString(element.businessObject.text);

    if (parsedString) {
      let times;

      if (parsedString.time) {
        times = [ parsedString.time, '' ];
      } else if (parsedString.times) {
        times = parsedString.times;
      } else {
        times = [ '', '' ];
      }

      this.state = {
        type: parsedString.type,
        times: times
      };
    } else {
      this.state = {
        type: EXACT,
        times: [ '', '' ]
      };
    }

    const debounceInput = context.injector.get('debounceInput');

    this.debouncedEditCell = debounceInput(this.editCell.bind(this));
    this.editCell = this.editCell.bind(this);

    this.onTypeChange = this.onTypeChange.bind(this);
    this.onSetStartTimeNowClick = this.onSetStartTimeNowClick.bind(this);
    this.onSetEndTimeNowClick = this.onSetEndTimeNowClick.bind(this);
    this.onStartTimeInput = this.onStartTimeInput.bind(this);
    this.onEndTimeInput = this.onEndTimeInput.bind(this);
  }

  editCell(cell, text) {
    this._modeling.editCell(cell, text);
  }

  onTypeChange(value) {
    const { element } = this.props.context;

    const { times } = this.state;

    this.setState({
      type: value
    });

    if (parseString(getTimeString(value, times))) {
      this.editCell(element.businessObject, getTimeString(value, times));
    }
  }

  onSetStartTimeNowClick() {
    const { element } = this.props.context;

    const { times, type } = this.state;

    const time = getSampleTime();

    this.setState({
      times: [ time, times[1] ]
    });

    if (parseString(getTimeString(type, [ time, times[1] ]))) {
      this.editCell(element.businessObject, getTimeString(type, [ time, times[1] ]));
    }
  }

  onSetEndTimeNowClick() {
    const { element } = this.props.context;

    const { times, type } = this.state;

    const time = getSampleTime();

    this.setState({
      times: [ times[0], time ]
    });

    if (parseString(getTimeString(type, [ times[0], time ]))) {
      this.editCell(element.businessObject, getTimeString(type, [ times[0], time ]));
    }
  }

  onStartTimeInput({ value }) {
    const { element } = this.props.context;

    const { times, type } = this.state;

    this.setState({
      times: [ value, times[1] ]
    });

    this.debouncedEditCell(
      element.businessObject,
      getTimeString(type, [ value, times[1] ])
    );
  }

  onEndTimeInput({ value }) {
    const { element } = this.props.context;

    const { times, type } = this.state;

    this.setState({
      times: [ times[0], value ]
    });

    this.debouncedEditCell(
      element.businessObject,
      getTimeString(type, [ times[0], value ])
    );
  }

  render() {
    const { times, type } = this.state;

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
      <div class="context-menu-container simple-time-edit">

        <h3 class="dms-heading">{ this._translate('Edit time') }</h3>

        <div className="dms-fill-row">
          <InputSelect
            label={ this._translate('Time') }
            noInput={ true }
            onChange={ this.onTypeChange }
            options={ options }
            value={ type } />
        </div>

        <h4 class="dms-heading">
          {
            type === BETWEEN
              ? this._translate('Edit start time')
              : this._translate('Set time')
          }
        </h4>

        <div>
          <ValidatedInput
            label={ this._translate('Start time') }
            className="start-time-input dms-block"
            onInput={ this.onStartTimeInput }
            placeholder={ this._translate('e.g. { example } ', {
              example: getSampleDate()
            }) }
            validate={ string => validateISOString(string) &&
              this._translate(validateISOString(string)) }
            value={ times[0] } />

          <p className="dms-hint">
            <button type="button"
              className="use-now"
              onClick={ this.onSetStartTimeNowClick }>
              { this._translate('Use now') }
            </button>.
          </p>
        </div>

        {
          type === BETWEEN
            && <h4 class="dms-heading">
              {this._translate('Edit end time')}
            </h4>
        }

        {
          type === BETWEEN
            && <div>
              <ValidatedInput
                label={ this._translate('End time') }
                className="end-time-input dms-block"
                onInput={ this.onEndTimeInput }
                placeholder={ this._translate('e.g. { example } ', {
                  example: getSampleDate()
                }) }
                validate={ string => validateISOString(string) &&
                  this._translate(validateISOString(string)) }
                value={ times[1] }>
              </ValidatedInput>

              <p className="dms-hint">
                <button type="button"
                  className="use-now"
                  onClick={ this.onSetEndTimeNowClick }>
                  { this._translate('Use now') }
                </button>.
              </p>
            </div>
        }

      </div>
    );
  }
}