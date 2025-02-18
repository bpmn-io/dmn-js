import { Component } from 'inferno';

import escapeHtml from 'escape-html';

import {
  getRange,
  setRange,
  applyRange,
  getWindowSelection
} from 'selection-ranges';

import selectionUpdate from 'selection-update';


/**
 * A content ediable that performs proper selection updates on
 * editable changes. It normalizes editor operations by allowing
 * only <br/> and plain text to be inserted.
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
 *       <ContentEditable
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
export default class ContentEditable extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {};

    // TODO(nikku): remove once we drop IE 11 support
    if (isIE()) {

      // onInput shim for IE <= 11
      this.onInputIEPolyfill = (event) => {

        var oldText = this.node.innerHTML;

        setTimeout(() => {

          var text = this.node.innerHTML;
          if (oldText !== text) {
            this.onInput(event);
          }
        }, 0);
      };

    }
  }

  componentWillUpdate(newProps, newState) {

    // save old selection + text for later
    var node = this.node;

    var range = newState.focussed && getRange(node);

    this.selected = range && {
      range: range,
      text: innerText(node)
    };
  }

  componentDidUpdate() {

    var selected = this.selected;

    if (!selected) {
      return;
    }

    // compute and restore selection based on
    // (possibly new) text

    const range = selected.range;
    const text = selected.text;

    const node = this.node;

    const newText = innerText(node);

    const newRange = (
      newText !== text
        ? selectionUpdate(range, text, newText)
        : range
    );

    setRange(node, newRange);
  }

  onFocus = event => {
    var propsFocus = this.props.onFocus;

    this.setState({
      focussed: true
    });

    if (typeof propsFocus === 'function') {
      propsFocus(event);
    }
  };

  onBlur = event => {
    const {
      onBlur,
      onChange,
      value
    } = this.props;

    this.setState({
      focussed: false
    });

    if (typeof onChange === 'function' && this.node) {
      const currentValue = innerText(this.node);

      if (currentValue !== value) {
        onChange(currentValue);
      }
    }

    if (typeof onBlur === 'function') {
      onBlur(event);
    }
  };

  onkeydown = (event) => {

    // enter
    if (event.which === 13) {

      // prevent default action (<br/> insert)
      event.preventDefault();

      if (this.props.ctrlForNewline && !isCmd(event)) {
        return;
      }

      if (this.props.singleLine) {
        return;
      }

      event.stopPropagation();

      insertLineBreak();

      this.onInput(event);
    }

  };

  onInput = (event) => {

    var propsInput = this.props.onInput;

    if (typeof propsInput !== 'function') {
      return;
    }

    var text = innerText(this.node);

    propsInput(text);
  };

  // TODO(barmac): remove once we drop IE 11 support
  onkeypress = (event) => {
    if (this.onInputIEPolyfill) {
      this.onInputIEPolyfill(event);
    }
  };

  onPaste = (event) => {

    // TODO(barmac): remove once we drop IE 11 support
    if (this.onInputIEPolyfill) {
      this.onInputIEPolyfill(event);
    }

    if (this.props.singleLine) {
      const text = (event.clipboardData || window.clipboardData).getData('text');

      // replace newline with space
      document.execCommand('insertText', false, text.replace(/\n/g, ' '));
      event.preventDefault();
    }
  };

  getClassName() {
    const {
      className,
      placeholder,
      value
    } = this.props;

    return [
      className || '',
      'content-editable',
      (!value && placeholder) ? 'placeholder' : ''
    ].join(' ');
  }

  render(props) {

    var {
      label,
      value,
      placeholder
    } = props;

    // QUIRK: must add trailing <br/> for line
    // breaks to properly work
    value =
      escapeHtml(value)
        .replace(/\r?\n/g, '<br/>') + '<br/>';

    return (
      <div
        aria-label={ label }
        role="textbox"
        aria-multiline={ !this.props.singleLine }
        tabIndex="0"
        className={ this.getClassName() }
        contentEditable="true"
        spellCheck="false"
        data-placeholder={ placeholder || '' }
        onInput={ this.onInput }
        onkeypress={ this.onkeypress } // intentionally lowercase to use native event
        onPaste={ this.onPaste }
        onFocus={ this.onFocus }
        onBlur={ this.onBlur }
        onkeydown={ this.onkeydown } // intentionally lowercase to use native event
        ref={ node => this.node = node }
        dangerouslySetInnerHTML={ { __html: value } }></div>
    );
  }

}

function brTag() {
  return document.createElement('br');
}

function innerText(node) {

  // QUIRK: we must remove the last trailing <br/>, if any
  return node.innerText.replace(/\n$/, '');
}

function insertLineBreak() {

  // insert line break at current insertation
  // point; this assumes that the correct element, i.e.
  // a <ContentEditable /> is currently focussed
  var selection = getWindowSelection();

  var range = selection.getRangeAt(0);

  if (!range) {
    return;
  }

  var newRange = range.cloneRange();

  var br = brTag();

  newRange.deleteContents();

  newRange.insertNode(br);

  newRange.setStartAfter(br);
  newRange.setEndAfter(br);

  applyRange(newRange);
}

function isIE() {
  var ua = window.navigator.userAgent;

  return (

    // IE 10 or older
    ua.indexOf('MSIE ') > 0 ||

    // IE 11
    ua.indexOf('Trident/') > 0
  );
}

function isCmd(event) {
  return event.metaKey || event.ctrlKey;
}