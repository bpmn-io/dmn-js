// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

// eslint-disable-next-line
import Input from '../../../components/Input';

import { parseString } from '../Utils';

export default class OutputNumberEdit extends Component {
  constructor(props, context) {
    super(props, context);

    this._modeling = context.injector.get('modeling');

    const { element } = this.props.context;

    const parsedString = parseString(element.businessObject.text);

    if (parsedString) {
      this.state = {
        value: parsedString.value
      };
    } else {
      this.state = {
        value: ''
      };
    }

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

    this.debouncedEditCell(element.businessObject, value);

    this.setState({
      value
    });
  }

  render() {
    const { value } = this.state;

    return (
      <div class="simple-number-edit">

        <div class="heading-medium margin-bottom-medium">Edit Number</div>

        <div class="heading-small margin-bottom-medium">Set Value</div>

        <Input
          onInput={ this.onInput }
          type="number"
          value={ value } />

      </div>
    );
  }
}