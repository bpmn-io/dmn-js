import { Component } from 'inferno';

import ValidatedInput from 'dmn-js-shared/lib/components/ValidatedInput';

import { normalizeTypeRef } from 'dmn-js-shared/lib/features/data-types/DataTypes';

import { validateDuration } from '../Utils';

const ERROR_MESSAGE = {
  'years and months duration': 'Must match PnYnM',
  'days and time duration': 'Must match PnDTnH'
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
    const normalizedType = normalizeTypeRef(this._type);

    if (!validateDuration(normalizedType, value)) {
      return this._translate(ERROR_MESSAGE[normalizedType]);
    }
  }

  _getPlaceholder() {
    const normalizedType = normalizeTypeRef(this._type);

    if (normalizedType === 'years and months duration') {
      return this._translate('e.g. { sample }', { sample: 'P1Y2M' });
    } else if (normalizedType === 'days and time duration') {
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
