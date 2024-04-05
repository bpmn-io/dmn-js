import { Component } from 'inferno';

import ValidatedInput from 'dmn-js-shared/lib/components/ValidatedInput';

import { validateDuration } from '../Utils';

const ERROR_MESSAGE = {
  yearMonthDuration: 'Must match PnYnM',
  dayTimeDuration: 'Must match PnDTnH'
};


export class DurationInput extends Component {
  constructor(props, context) {
    super(props, context);

    this._translate = context.injector.get('translate');
    this._type = props.type;

    this.onInput = this.onInput.bind(this);
    this.validate = this.validate.bind(this);

    this.state = {
      value: props.value
    };
  }

  onInput({ value }) {
    this.setState({
      value
    });

    this.props.onInput(value);
  }

  validate(value) {
    if (!validateDuration(this._type, value)) {
      return this._translate(ERROR_MESSAGE[this._type]);
    }
  }

  _getPlaceholder() {
    if (this._type === 'yearMonthDuration') {
      return this._translate('e.g. { sample }', { sample: 'P1Y2M' });
    } else if (this._type === 'dayTimeDuration') {
      this._translate('e.g. { sample }', { sample: 'P1DT2H' });
    }
  }

  render() {
    return (
      <ValidatedInput
        label={ this.props.label }
        type="text"
        onInput={ this.onInput }
        placeholder={ this._getPlaceholder() }
        validate={ this.validate }
        value={ this.state.value }
        className={ this.props.className }
      />
    );
  }
}
