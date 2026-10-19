import { Component } from 'inferno';

import FeelEditor from '@bpmn-io/feel-editor';

import { EditorView } from '@codemirror/view';

// commit before listeners which export the definitions
const SAVE_XML_PRIORITY = 1500;

/**
 * A drop-in replacement for ContentEditable which uses FEEL editor under the hood.
 * It does not support placeholder.
 *
 * The callback `onInput(text)` receives text (including line breaks)
 * only. Updating the value via props will update the selection
 * if needed, too.
 *
 * Without `onInput`, text is committed via `onChange` on blur. Undo and redo
 * key events do not leave the component then.
 *
 * Pending text is committed via `onChange` before the XML is saved, too.
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
 *         onChange={ this.handleChange }
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

    /** @type {string|null} text typed by the user which is not committed yet */
    this._pendingText = null;

    this._feelLanguageContext = context.injector?.get('feelLanguageContext', false);
    this._parent = context.injector?.get('_parent', false);
  }

  _getFeelLanguageContext() {
    return this._feelLanguageContext && this._feelLanguageContext.getConfig();
  }

  componentDidMount() {
    const feelLanguageContext = this._getFeelLanguageContext();

    this.editor = new FeelEditor({
      contentAttributes: {
        'aria-label': this.props.label
      },
      parserDialect: feelLanguageContext?.parserDialect,
      builtins: feelLanguageContext?.builtins,
      dialect: this.props.feelLanguageDialect,
      container: this.node,
      onChange: this.handleChange,
      value: this.state.value,
      variables: this.props.variables || [],
      extensions: [
        EditorView.lineWrapping
      ]
    });

    this.node.addEventListener('mousedown', this.handleMouseEvent);

    // `capture: true` is needed to precede Keyboard handlers
    this.node.addEventListener('keydown', this.handleKeyDownCapture, true);
    this.node.addEventListener('keydown', this.handleKeyDown);

    if (this._parent) {
      this._parent.on('saveXML.start', SAVE_XML_PRIORITY, this.commit);
    }

    if (this.props.autoFocus) {
      this.editor.focus(this.state.value.length);
    }
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;

    if (prevProps.value !== value) {

      // the new value takes precedence over uncommitted text
      this._pendingText = null;

      if (value !== this.state.value) {
        this.setState({
          value
        }, () => {
          this.editor.setValue(value);
        });
      }
    }

    if (!deepEqual(prevProps.variables, this.props.variables)) {
      this.editor.setVariables(this.props.variables);
    }
  }

  componentWillUnmount() {
    this.node.removeEventListener('mousedown', this.handleMouseEvent);

    // `capture: true` is needed to precede FEEL editor default handling
    this.node.removeEventListener('keydown', this.handleKeyDownCapture, true);
    this.node.removeEventListener('keydown', this.handleKeyDown);

    if (this._parent) {
      this._parent.off('saveXML.start', this.commit);
    }
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

    // the editor has no history of its own and, without `onInput`, text is
    // committed on blur only; global undo / redo would revert an unrelated command
    if (!this.props.onInput && isUndoRedo(event)) {
      event.stopPropagation();
    }
  };

  handleChange = (value) => {
    const { onInput } = this.props;

    this._pendingText = value === this.props.value ? null : value;

    this.setState({
      value
    });

    if (onInput) {
      onInput(value);
    }
  };

  commit = () => {
    const { onChange, value } = this.props;

    const text = this._pendingText;

    this._pendingText = null;

    if (onChange && text !== null && text !== value) {
      onChange(text);
    }
  };

  handleBlur = () => {
    const { onBlur } = this.props;

    this.commit();

    if (onBlur) {
      onBlur();
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
        onFocusOut={ this.handleBlur }
      />
    );
  }
}

function isCmd(event) {
  return event.metaKey || event.ctrlKey;
}

function isUndoRedo(event) {
  return isCmd(event) && [ 'z', 'y' ].includes(event.key?.toLowerCase());
}

function isAutocompleteOpen(node) {
  return node.querySelector('.cm-tooltip-autocomplete');
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
