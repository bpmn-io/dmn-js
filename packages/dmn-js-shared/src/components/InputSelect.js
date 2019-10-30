import { Component, createPortal } from 'inferno';

import {
  inject
} from 'table-js/lib/components';

import { assign } from 'min-dash';

import {
  domify,
  remove as domRemove
} from 'min-dom';


export default class InputSelect extends Component {

  constructor(props, context) {
    super(props, context);

    inject(this);

    const { value } = props;

    this.state = {
      value,
      optionsVisible: false
    };

    this._portalEl = null;
  }

  componentDidMount() {
    document.addEventListener('click', this.onGlobalClick);
    document.addEventListener('focusin', this.onFocusChanged);

    this.keyboard.addListener(this.onKeyboard);
  }

  componentWillUnmount() {
    document.removeEventListener('focusin', this.onFocusChanged);
    document.removeEventListener('click', this.onGlobalClick);

    this.keyboard.removeListener(this.onKeyboard);

    this.removePortalEl();
  }

  componentWillReceiveProps(props) {
    const { value } = props;

    this.setState({
      value
    });
  }

  componentWillUpdate(nextProps, nextState) {
    const { optionsVisible } = nextState;

    if (optionsVisible) {
      if (!this._portalEl) {
        this.addPortalEl();
      }
    } else {
      if (this._portalEl) {
        this.removePortalEl();
      }
    }
  }

  componentDidUpdate() {
    const { optionsVisible } = this.state;

    if (!optionsVisible || !this.inputNode) {
      return;
    }

    const { top, left, width, height } = this.inputNode.getBoundingClientRect();

    assign(this._portalEl.style, {
      top: `${top + height}px`,
      left: `${left}px`,
      width: `${width}px`
    });
  }

  addPortalEl() {
    this._portalEl = domify('<div class="dms-select-options"></div>');

    const container = this.renderer.getContainer();

    container.appendChild(this._portalEl);

    // suppress mousedown event propagation to handle click events inside the component
    this._portalEl.addEventListener('mousedown', stopPropagation);
  }

  removePortalEl() {
    if (this._portalEl) {
      this._portalEl.removeEventListener('mousedown', stopPropagation);

      domRemove(this._portalEl);

      this._portalEl = null;
    }
  }

  onChange = (value) => {
    this.setState({
      value
    });

    const { onChange } = this.props;

    if (typeof onChange !== 'function') {
      return;
    }

    onChange(value);
  }

  onInputClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.setOptionsVisible(!this.state.optionsVisible);

    this.focusInput();
  }

  onInput = (event) => {
    const { value } = event.target;

    this.onChange(value);
  }

  onOptionClick = (value, event) => {
    event.preventDefault();
    event.stopPropagation();

    this.setOptionsVisible(false);

    this.onChange(value);

    this.focusInput();
  }

  /**
   * Focus input node
   */
  focusInput() {
    const node = this.inputNode;

    node.focus();

    // move cursor to end of input
    if ('selectionStart' in node) {
      node.selectionStart = 100000;
    }
  }

  checkClose(focusTarget) {

    if (this._portalEl
      && !this._portalEl.contains(focusTarget)
      && !this.parentNode.contains(focusTarget)) {
      this.setOptionsVisible(false);
    }
  }

  onFocusChanged = (evt) => {
    this.checkClose(evt.target);
  }

  onGlobalClick = (evt) => {
    this.checkClose(evt.target);
  }

  select(direction) {

    const {
      options
    } = this.props;

    const {
      value
    } = this.state;

    if (!options) {
      return;
    }

    const option = options.filter(o => o.value === value)[0];

    const idx = option
      ? options.indexOf(option)
      : -1;

    const nextIdx = (
      idx === -1
        ? (
          direction === 1
            ? 0
            : options.length - 1)
        : ((idx + direction) % options.length)
    );

    const nextOption = options[nextIdx < 0 ? options.length + nextIdx : nextIdx];

    this.onChange(nextOption.value);
  }

  setOptionsVisible(optionsVisible) {
    this.setState({
      optionsVisible
    });
  }

  onKeyDown = (evt) => {

    const {
      optionsVisible
    } = this.state;

    var code = evt.which;

    // DOWN or UP
    if (code === 40 || code === 38) {

      evt.stopPropagation();
      evt.preventDefault();

      if (!optionsVisible) {
        this.setOptionsVisible(true);
      } else {
        this.select(code === 40 ? 1 : -1);
      }
    }

    if (optionsVisible) {

      // ENTER
      // ESC
      if (code === 13 || code === 27) {
        evt.stopPropagation();
        evt.preventDefault();

        this.setOptionsVisible(false);
      }
    }
  }

  onKeyboard = (keycode) => {
    const { optionsVisible } = this.state;

    if (!optionsVisible) {
      return;
    }

    // close on ESC
    if (keycode === 27) {
      this.setOptionsVisible(false);

      return true;
    }
  }

  renderOptions(options, activeOption) {
    return (
      <div className="options">
        {
          options.map(option => {
            return (
              <div
                className={
                  [ 'option', activeOption === option ? 'active' : '' ].join(' ')
                }
                data-value={ option.value }
                onClick={ e => this.onOptionClick(option.value, e) }>
                { option.label }
              </div>
            );
          })
        }
      </div>
    );
  }

  render() {
    const {
      className,
      options,
      noInput
    } = this.props;

    const {
      optionsVisible,
      value
    } = this.state;

    const option = options ? options.filter(o => o.value === value)[0] : false;

    const label = option ? option.label : value;

    return (
      <div
        ref={ node => this.parentNode = node }
        className={ [ className || '', 'dms-input-select' ].join(' ') }
        onClick={ this.onInputClick }>
        {
          noInput
            ? <div
              className="dms-input"
              tabindex="0"
              onKeyDown={ this.onKeyDown }
              ref={ node => this.inputNode = node }>{ label }</div>
            : <input
              className="dms-input"
              onInput={ this.onInput }
              onKeyDown={ this.onKeyDown }
              spellcheck="false"
              ref={ node => this.inputNode = node }
              type="text"
              value={ value } />
        }
        <span
          className={ [
            'dms-input-select-icon',
            optionsVisible ? 'dmn-icon-up' : 'dmn-icon-down'
          ].join(' ') }>
        </span>
        {
          optionsVisible
            && createPortal(this.renderOptions(options, option), this._portalEl)
        }
      </div>
    );
  }
}

InputSelect.$inject = [ 'keyboard', 'renderer' ];


// helper ////
function stopPropagation(event) {
  event.stopPropagation();
}
