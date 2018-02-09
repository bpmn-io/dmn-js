// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

// eslint-disable-next-line
import SelectComponent from 'dmn-js-shared/lib/components/SelectComponent';

import { parseString } from '../Utils';

const TRUE = 'true',
      FALSE = 'false',
      NONE = 'none';


export default class BooleanEdit extends Component {
  constructor(props, context) {
    super(props, context);

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

    const options = [{
      label: '-',
      value: NONE
    }, {
      label: 'Yes',
      value: TRUE
    }, {
      label: 'No',
      value: FALSE
    }];

    return (
      <div class="simple-boolean-edit">

        <div class="heading-medium margin-bottom-medium">Edit Boolean</div>

        <div class="heading-small margin-bottom-medium">Set Value</div>

        <SelectComponent
          onChange={ this.onChange }
          options={ options }
          value={ value } />

      </div>
    );
  }
}