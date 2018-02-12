import { Component } from 'inferno';

// eslint-disable-next-line
import Input from './Input';

/**
 * Input with optional validation.
 */
export default class ValidatedInput extends Component {

  constructor(props, context) {
    super(props, context);

    const { validate, value } = props;

    const validationWarning = validate ? validate(value || '') : undefined;

    this.state = {
      validationWarning,
      value
    };

    this.onInput = this.onInput.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  componentWillReceiveProps(props) {
    const { validate, value } = props;

    const validationWarning = validate ? validate(value || '') : undefined;

    this.setState({
      validationWarning,
      value
    });
  }

  onInput(value) {
    const { onInput, validate } = this.props;

    const validationWarning = validate ? validate(value) : undefined;

    this.setState({
      validationWarning,
      value
    });

    if (typeof onInput !== 'function') {
      return;
    }

    onInput && onInput({
      isValid: !validationWarning,
      value
    });
  }

  onKeyDown(event) {
    const { target } = event,
          { value } = target;

    const { onKeyDown, validate } = this.props;

    const validationWarning = validate ? validate(value) : undefined;

    if (typeof onKeyDown !== 'function') {
      return;
    }

    onKeyDown({
      isValid: !validationWarning,
      value,
      event
    });
  }

  onKeyUp(event) {
    const { target } = event,
          { value } = target;

    const { onKeyUp, validate } = this.props;

    const validationWarning = validate ? validate(value) : undefined;

    if (typeof onKeyUp !== 'function') {
      return;
    }

    onKeyUp({
      isValid: !validationWarning,
      value,
      event
    });
  }

  render() {
    const { children, placeholder, type } = this.props;

    const { validationWarning, value } = this.state;

    const classes = [ 'input' ];

    if (validationWarning) {
      classes.push('invalid');
    }

    return (
      <span class="validated-text-input-component">
        <Input
          className={ classes.join(' ') }
          onInput={ this.onInput }
          onKeyDown={ this.onKeyDown }
          onKeyUp={ this.onKeyUp }
          placeholder={ placeholder || '' }
          type={ type }
          value={ value || '' } />
        {
          children
        }
        {
          validationWarning &&
            <span class="validation-warning display-block margin-top-medium">
              { validationWarning }
            </span>
        }
      </span>
    );
  }

}