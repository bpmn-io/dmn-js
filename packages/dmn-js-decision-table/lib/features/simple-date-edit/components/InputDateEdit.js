// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

// eslint-disable-next-line
import ValidatedInput from '../../../components/ValidatedInput';

// eslint-disable-next-line
import Button from '../../../components/Button';

// eslint-disable-next-line
import SelectComponent from '../../../components/SelectComponent';

import { getDateString, getSampleDate, validateISOString, parseString } from '../Utils';

const EXACT = 'exact',
      BEFORE = 'before',
      AFTER = 'after',
      BETWEEN = 'between';


export default class InputDateEdit extends Component {
  constructor(props, context) {
    super(props, context);

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

  onStartDateInput({ isValid, value }) {
    if (isValid) {
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
  }

  onEndDateInput({ isValid, value }) {
    if (isValid) {
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
  }

  render() {
    const { dates, type } = this.state;

    const options = [{
      label: 'Exactly',
      value: EXACT
    }, {
      label: 'Before',
      value: BEFORE
    }, {
      label: 'After',
      value: AFTER
    }, {
      label: 'Between',
      value: BETWEEN
    }];

    return (
      <div class="simple-date-edit">

        <div class="heading-medium margin-bottom-medium">Edit Date</div>

        <SelectComponent
          onChange={ this.onTypeChange }
          options={ options }
          value={ type } />

        {
          type === BETWEEN
            ? <div class="heading-small margin-bottom-medium margin-top-medium">
              Edit Start Date
            </div>
            : <div class="heading-small margin-bottom-medium margin-top-medium">
              Set Date
            </div>
        }

        <div className="no-wrap">
          <ValidatedInput
            onInput={ this.onStartDateInput }
            placeholder={ `e.g. ${ getSampleDate() }` }
            validate={ validateISOString }
            value={ dates[0] }>

            <Button
              className="margin-left-medium"
              onClick={ this.onSetStartDateTodayClick }>Today</Button>

          </ValidatedInput>
        </div>

        {
          type === BETWEEN
            && <div class="heading-small margin-bottom-medium margin-top-medium">
              Edit End Date
            </div>
        }

        {
          type === BETWEEN
            && <div className="no-wrap">
              <ValidatedInput
                onInput={ this.onEndDateInput }
                placeholder={ `e.g. ${ getSampleDate() }` }
                validate={ validateISOString }
                value={ dates[1] }>

                <Button
                  className="margin-left-medium"
                  onClick={ this.onSetEndDateTodayClick }>Today</Button>

              </ValidatedInput>
            </div>
        }

      </div>
    );
  }
}