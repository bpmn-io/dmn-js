// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

export default class Input extends Component {
  constructor(props, context) {
    super(props, context);

    this.onInput = this.onInput.bind(this);
  }

  onInput(event) {
    const { onInput } = this.props;

    if (typeof onInput !== 'function') {
      return;
    }

    const { value } = event.target;

    onInput(value);
  }
  
  render() {
    const {
      className,
      type,
      value
    } = this.props;

    return <input
      className={ [ className || '', 'input' ].join(' ') }
      onInput={ this.onInput }
      type={ type }
      value={ value } />
  }
}