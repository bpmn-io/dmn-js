import { Component } from 'inferno';

import FeelEditor from '@bpmn-io/feel-editor';

/**
 * A drop-in replacement for ContentEditable which uses FEEL editor under the hood.
 * It does not support placeholder.
 *
 * The callback `onInput(text)` receives text (including line breaks)
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

    /** @type {HTMLElement} */
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

    // `capture: true` is needed to precede Keyboard handlers
    this.node.addEventListener('keydown', this.handleKeyDownCapture, true);
    this.node.addEventListener('keydown', this.handleKeyDown);

    if (this.props.autoFocus) {
      this.editor.focus(this.state.value.length);
    }
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

    // `capture: true` is needed to precede FEEL editor default handling
    this.node.removeEventListener('keydown', this.handleKeyDownCapture, true);
    this.node.removeEventListener('keydown', this.handleKeyDown);
  }

  handleMouseEvent = event => {
    event.stopPropagation();
  };

  handleKeyDownCapture = event => {
    if (event.key === 'Enter') {
      if (isAutocompleteOpen(this.node)) {
        event.triggeredFromAutocomplete = true;
        return;
      }

      // supress non cmd+enter newline
      if (this.props.ctrlForNewline && !isCmd(event)) {
        event.preventDefault();
      }

      if (this.props.singleLine) {
        event.preventDefault();
      }
    }
  };

  /**
   * @param {KeyboardEvent} event
   */
  handleKeyDown = event => {

    // contain the event in the component to not trigger global handlers
    if ([ 'Enter', 'Escape' ].includes(event.key) && event.triggeredFromAutocomplete) {
      event.stopPropagation();
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

  setNode = node => {
    this.node = node;
  };

  render() {
    return (
      <div
        className={ [ 'literal-expression', this.props.className || '' ].join(' ') }
        ref={ this.setNode }
        onClick={ this.handleMouseEvent }
        onFocusIn={ this.props.onFocus }
        onFocusOut={ this.props.onBlur }
      />
    );
  }
}

function isCmd(event) {
  return event.metaKey || event.ctrlKey;
}

function isAutocompleteOpen(node) {
  return node.querySelector('.cm-tooltip-autocomplete');
}
