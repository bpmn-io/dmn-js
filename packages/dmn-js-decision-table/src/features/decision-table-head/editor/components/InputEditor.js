import { Component } from 'inferno';

import ContentEditable from 'dmn-js-shared/lib/components/ContentEditable';

export default class InputEditor extends Component {

  constructor(props, context) {
    super(props, context);

    this.translate = context.injector ? context.injector.get('translate') : noopTranslate;

    this.handleValue = (text) => {

      let change = { text };

      this.handleChange(change);
    };

    this.handleLabelChange = (value) => {

      // default to <undefined> for empty string
      var label = value || undefined;

      this.handleChange({ label });
    };
  }

  handleChange(changes) {
    var { onChange } = this.props;

    if (typeof onChange === 'function') {
      onChange(changes);
    }
  }

  render() {

    const {
      label,
      text
    } = this.props;

    return (
      <div className="context-menu-container ref-input-editor input-edit">

        <div className="dms-form-control">
          <ContentEditable
            className="dms-input-label"
            value={ label || '' }
            placeholder={ this.translate('Input') }
            singleLine
            onInput={ this.handleLabelChange } />
        </div>

        <div className="dms-form-control">
          <label className="dms-label">
            {
              this.translate('Expression')
            }
          </label>

          <ContentEditable
            placeholder="enter expression"
            className={
              [
                'ref-text',
                'dms-input'
              ].join(' ')
            }
            onInput={ this.handleValue }
            value={ text || '' } />
        </div>
      </div>
    );
  }
}

function noopTranslate(str) {
  return str;
}
