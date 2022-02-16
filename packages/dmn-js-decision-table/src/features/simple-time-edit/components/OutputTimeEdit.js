import { Component } from 'inferno';

import ValidatedInput from 'dmn-js-shared/lib/components/ValidatedInput';

import {
  getSampleTime,
  validateISOString,
  parseString
} from '../Utils';


export default class OutputTimeEdit extends Component {

  constructor(props, context) {
    super(props, context);

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

  onInput({ isValid, value }) {
    if (isValid) {
      const { element } = this.props.context;

      this.setState({
        date: value
      });

      this.debouncedEditCell(element.businessObject, `time("${ value }")`);

    }
  }

  render() {
    const { date } = this.state;

    return (
      <div class="context-menu-container simple-time-edit">

        <h3 class="dms-heading">Edit Date</h3>

        <h4 class="dms-heading">Set Date</h4>

        <div>
          <ValidatedInput
            onInput={ this.onInput }
            placeholder={ `e.g. ${ getSampleTime() }` }
            validate={ validateISOString }
            value={ date }
            className="dms-block">
          </ValidatedInput>

          <p className="dms-hint">
            Set date <button type="button"
              className="use-now"
              onClick={ this.onClick }>to now</button>.
          </p>
        </div>

      </div>
    );
  }
}