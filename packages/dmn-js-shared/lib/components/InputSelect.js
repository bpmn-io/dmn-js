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

  componentWillMount() {
    document.addEventListener('click', this.onClick);

    this.keyboard.addListener(this.onKeyboard);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClick);

    this.keyboard.addListener(this.onKeyboard);
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
  }

  removePortalEl() {
    if (this._portalEl) {
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

    this.setState({
      optionsVisible: true
    });
  }

  onInput = (event) => {
    const { value } = event.target;

    this.onChange(value);
  }

  onOptionClick = (value, event) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({
      optionsVisible: false
    });

    this.onChange(value);
  }

  onClick = ({ target }) => {
    if (this._portalEl
      && !this._portalEl.contains(target)
      && !this.inputNode.contains(target)) {
      this.setState({
        optionsVisible: false
      });

      this.removePortalEl();
    }
  }

  onKeyboard = (keycode) => {
    const { optionsVisible } = this.state;

    if (!optionsVisible) {
      return;
    }

    // close on ESC
    if (keycode === 27) {
      this.setState({
        optionsVisible: false
      });

      return true;
    }
  }

  renderOptions(options) {
    return (
      <div className="options">
        {
          options.map(option => {
            return (
              <div
                className="option"
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
      options
    } = this.props;

    const {
      optionsVisible,
      value
    } = this.state;

    return (
      <div
        ref={ node => this.parentNode = node }
        className={ [ className || '', 'dms-input-select' ].join(' ') }
        onClick={ this.onInputClick }>
        <input
          className="dms-input"
          onInput={ this.onInput }
          ref={ node => this.inputNode = node }
          type="text"
          value={ value } />
        {
          optionsVisible
            ? <span className="dms-input-select-icon dmn-icon-up"></span>
            : <span className="dms-input-select-icon dmn-icon-down"></span>
        }
        {
          optionsVisible
            && createPortal(this.renderOptions(options), this._portalEl)
        }
      </div>
    );
  }
}

InputSelect.$inject = [ 'keyboard', 'renderer' ];