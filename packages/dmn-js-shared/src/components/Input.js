import { Component } from 'inferno';


export default class Input extends Component {

  constructor(props, context) {
    super(props, context);
  }

  onInput = (event) => {
    const { onInput } = this.props;

    if (typeof onInput !== 'function') {
      return;
    }

    onInput(event.target.value);
  }

  onKeyDown = (event) => {
    const { onKeyDown } = this.props;

    if (typeof onKeyDown !== 'function') {
      return;
    }

    onKeyDown(event);
  }

  onKeyUp = (event) => {
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
        className={ [ className || '', 'dms-input' ].join(' ') }
        placeholder={ placeholder || '' }
        onInput={ this.onInput }
        onKeyDown={ this.onKeyDown }
        onKeyUp={ this.onKeyUp }
        spellcheck="false"
        type={ type || 'text' }
        value={ value } />
    );
  }
}