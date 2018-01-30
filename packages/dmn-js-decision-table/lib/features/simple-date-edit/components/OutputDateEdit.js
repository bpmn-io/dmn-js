// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

// eslint-disable-next-line
import ValidatedInput from '../../../components/ValidatedInput';

// eslint-disable-next-line
import Button from '../../../components/Button';

import { getSampleDate, validateISOString, parseString } from '../Utils';


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

  onInput({ isValid, value }) {
    if (isValid) {
      const { element } = this.props.context;

      this.setState({
        date: value
      });

      this.debouncedEditCell(element.businessObject, `date and time("${ value }")`);

    }
  }

  render() {
    const { date } = this.state;

    return (
      <div class="simple-date-edit">

        <div class="heading-medium margin-bottom-medium">Edit Date</div>

        <div class="heading-small margin-bottom-medium">Set Date</div>

        <div className="no-wrap">
          <ValidatedInput
            onInput={ this.onInput }
            placeholder={ `e.g. ${ getSampleDate() }` }
            validate={ validateISOString }
            value={ date }>

            <Button
              className="margin-left-medium"
              onClick={ this.onClick }>Today</Button>

          </ValidatedInput>
        </div>

      </div>
    );
  }
}