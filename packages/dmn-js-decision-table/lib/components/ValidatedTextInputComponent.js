
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

/**
 * Text input with optional validation.
 */
export default class ValidatedTextInputComponent extends Component {

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
  }

  componentWillReceiveProps(props) {
    const { validate, value } = props;

    const validationWarning = validate ? validate(value || '') : undefined;

    this.setState({
      validationWarning,
      value
    });
  }

  onInput(event) {
    const { validate, onInputChange } = this.props;

    const { value } = event.target;

    const validationWarning = validate ? validate(value) : undefined;

    this.setState({
      validationWarning,
      value
    });

    onInputChange && onInputChange({
      isValid: !validationWarning,
      value
    });
  }

  onKeyDown(event) {
    const { keyCode } = event;

    const { onEnter } = this.props;

    const { validationWarning, value } = this.state;

    if (isEnter(keyCode) && !validationWarning) {
      onEnter && onEnter(value);

      this.setState({
        value: ''
      });
    }
  }

  render() {
    const { ...rest } = this.props;

    const { placeholder, validationWarning, value } = this.state;

    const classes = [ 'input' ];

    if (validationWarning) {
      classes.push('invalid');
    }

    return (
      <span class="validated-text-input-component">
        <input
          className={ classes.join(' ') }
          onInput={ this.onInput }
          onKeyDown={ this.onKeyDown }
          placeholder={ placeholder || '' }
          type="text"
          value={ value || '' }
          { ...rest } />
        {
          validationWarning
            && <span class="validation-warning display-block margin-top-medium">{ validationWarning }</span>
        }
      </span>
    );
  }

}

////////// helpers //////////

function isEnter(keyCode) {
  return keyCode === 13;
}