import { Component } from 'inferno';

import FeelEditor from '@bpmn-io/feel-editor';

/**
 * A drop-in replacement for ContentEditable which uses FEEL editor under the hood.
 * It does not support placeholder.
 *
 * The callback `onInput(text)` recieves text (including line breaks)
 * only. Updating the value via props will update the selection
 * if needed, too.
 *
 * @example
 *
 * class SomeComponent extends Component {
 *
 *   render() {
 *     return (
 *       <LiteralExpression
 *         className="some classes"
 *         value={ this.state.text }
 *         onInput={ this.handleInput }
 *         onFocus={ ... }
 *         onBlur={ ... } />
 *     );
 *   }
 *
 * }
 *
 */
export default class LiteralExpression extends Component {

  constructor(props, context) {
    super(props, context);

    this.node = null;
    this.editor = null;

    this.state = {
      value: props.value
    };
  }

  componentDidMount() {
    this.editor = new FeelEditor({
      container: this.node,
      onChange: this.handleChange,
      value: this.state.value
    });

    this.node.addEventListener('mousedown', this.handleMouseEvent);
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;

    if (prevProps.value !== value && value !== this.state.value) {
      this.setState({
        value
      }, () => {
        this.editor.setValue(value);
      });
    }
  }

  componentWillUnmount() {
    this.node.removeEventListener('mousedown', this.handleMouseEvent);
  }

  handleMouseEvent = (event) => {
    event.stopPropagation();
  };

  handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.stopPropagation();
      event.preventDefault();
    }
  };

  handleChange = (value) => {
    const { onInput } = this.props;

    this.setState({
      value
    });

    if (onInput) {
      onInput(value);
    }
  };

  render() {
    return (
      <div
        className={ [ 'literal-expression', this.props.className || '' ].join(' ') }
        ref={ node => this.node = node }
        onClick={ this.handleMouseEvent }
        onKeyDown={ this.handleKeyDown }
        onFocusIn={ this.props.onFocus }
        onFocusOut={ this.props.onBlur }
      />
    );
  }
}
