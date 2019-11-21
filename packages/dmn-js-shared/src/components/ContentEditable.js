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
      this.onPaste = this.onKeypress = (event) => {

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

  onFocus = () => {
    var propsFocus = this.props.onFocus;

    this.setState({
      focussed: true
    });

    if (typeof propsFocus === 'function') {
      propsFocus();
    }
  }

  onBlur = () => {
    var propsBlur = this.props.onBlur;

    this.setState({
      focussed: false
    });

    if (typeof propsBlur === 'function') {
      propsBlur();
    }
  }

  onKeydown = (event) => {

    // enter
    if (event.which === 13) {

      // prevent default action (<br/> insert)
      event.preventDefault();

      if (this.props.ctrlForNewline && !isCmd(event)) {
        return;
      }

      event.stopPropagation();

      insertLineBreak();

      this.onInput(event);
    }

  }

  onInput = (event) => {

    var propsInput = this.props.onInput;

    if (typeof propsInput !== 'function') {
      return;
    }

    var text = innerText(this.node);

    propsInput(text);
  }

  // stubs for modern browsers; actual implementation
  // for IE 11 to polyfill missing <input> event on [contentediable]
  onPaste = noop;
  onKeypress = noop;


  render(props) {

    var {
      value,
      className
    } = props;

    // QUIRK: must add trailing <br/> for line
    // breaks to properly work
    value =
      escapeHtml(value)
        .replace(/\r?\n/g, '<br/>') + '<br/>';

    return (
      <div
        className={ [ className || '', 'content-editable' ].join(' ') }
        contentEditable="true"
        spellcheck="false"
        onInput={ this.onInput }
        onKeypress={ this.onKeypress }
        onPaste={ this.onPaste }
        onFocus={ this.onFocus }
        onBlur={ this.onBlur }
        onKeydown={ this.onKeydown }
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

function noop() { }

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