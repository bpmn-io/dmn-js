import { Component } from 'inferno';

import ValidatedInput from 'dmn-js-shared/lib/components/ValidatedInput';

import {
  getSampleDate,
  validateISOString,
  parseString
} from '../Utils';


export default class OutputDateEdit extends Component {

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

    const date = getSampleDate();

    this.setState({
      date
    });

    this.editCell(element.businessObject, `date and time("${ date }")`);
  }

  onInput({ value }) {
    const { element } = this.props.context;

    this.setState({
      date: value
    });

    this.debouncedEditCell(element.businessObject, `date and time("${ value }")`);
  }

  render() {
    const { date } = this.state;

    return (
      <div class="context-menu-container simple-date-edit">

        <h3 class="dms-heading">Edit date and time</h3>

        <h4 class="dms-heading">Set date and time</h4>

        <div>
          <ValidatedInput
            onInput={ this.onInput }
            placeholder={ `e.g. ${ getSampleDate() }` }
            validate={ validateISOString }
            value={ date }
            className="dms-block">
          </ValidatedInput>

          <p className="dms-hint">
            Use <button type="button"
              className="use-today"
              onClick={ this.onClick }>today</button>.
          </p>
        </div>

      </div>
    );
  }
}