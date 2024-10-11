import { Component } from 'inferno';


export default class Input extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      value: props.value
    };
  }

  onInput = (event) => {
    const { onInput } = this.props;

    const value = event.target.value;

    this.setState({
      value
    }, () => {
      if (typeof onInput !== 'function') {
        return;
      }

      onInput(value);
    });
  };

  onChange = (event) => {
    const { onChange } = this.props;

    if (typeof onChange !== 'function') {
      return;
    }

    onChange(event.target.value);
  };

  onKeyDown = (event) => {
    const { onKeyDown } = this.props;

    if (typeof onKeyDown !== 'function') {
      return;
    }

    onKeyDown(event);
  };

  onKeyUp = (event) => {
    const { onKeyUp } = this.props;

    if (typeof onKeyUp !== 'function') {
      return;
    }

    onKeyUp(event);
  };

  componentDidUpdate(prevProps) {
    const { value } = this.props;

    if (value !== prevProps.value && value !== this.state.value) {
      this.setState({
        value
      });
    }
  }

  render() {
    const {
      className,
      label,
      id,
      placeholder,
      type
    } = this.props;

    const { value } = this.state;

    return (
      <input
        aria-label={ label }
        className={ [ className || '', 'dms-input' ].join(' ') }
        placeholder={ placeholder || '' }
        onChange={ this.onChange }
        onInput={ this.onInput }
        onKeyDown={ this.onKeyDown }
        onKeyUp={ this.onKeyUp }
        spellCheck="false"
        type={ type || 'text' }
        value={ value }
        id={ id } />
    );
  }
}