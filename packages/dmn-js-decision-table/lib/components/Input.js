// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

export default class Input extends Component {
  constructor(props, context) {
    super(props, context);

    this.onInput = this.onInput.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  onInput(event) {
    const { onInput } = this.props;

    if (typeof onInput !== 'function') {
      return;
    }

    const { value } = event.target;

    onInput(value);
  }

  onKeyDown(event) {
    const { onKeyDown } = this.props;

    if (typeof onKeyDown !== 'function') {
      return;
    }

    onKeyDown(event);
  }

  onKeyUp(event) {
    const { onKeyUp } = this.props;

    if (typeof onKeyUp !== 'function') {
      return;
    }

    onKeyUp(event);
  }

  render() {
    const {
      className,
      placeholder,
      type,
      value
    } = this.props;

    return (
      <input
        className={ [ className || '', 'input' ].join(' ') }
        placeholder={ placeholder || '' }
        onInput={ this.onInput }
        onKeyDown={ this.onKeyDown }
        onKeyUp={ this.onKeyUp }
        type={ type }
        value={ value } />
    );
  }
}