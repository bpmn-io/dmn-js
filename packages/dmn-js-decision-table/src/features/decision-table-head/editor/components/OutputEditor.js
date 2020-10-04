import { Component } from 'inferno';

import ContentEditable from 'dmn-js-shared/lib/components/ContentEditable';
import Input from 'dmn-js-shared/lib/components/Input';


export default class OutputEditor extends Component {

  constructor(props, context) {
    super(props, context);

    this.translate = context.injector ? context.injector.get('translate') : noopTranslate;
    this.isNameInvalid = false;

    this.validateName = (name) => {
      this.isNameInvalid = /\s/.test(name);
    };

    this.setName = (name) => {
      name = name || undefined;
      this.validateName(name);

      this.handleChange({ name });
    };

    this.setLabel = (label) => {
      label = label || undefined;

      this.handleChange({ label });
    };
  }


  handleChange(changes) {
    var { onChange } = this.props;

    if (typeof onChange === 'function') {
      onChange(changes);
    }
  }

  renderValidation() {
    if (this.isNameInvalid) {
      return (
        <div className='output-warning' style={ { color: 'red' } }>
          Whitespaces not allowed
        </div>
      );
    }
    return (<div><br /></div>);
  }

  render() {

    const {
      name,
      label
    } = this.props;
    this.validateName(name);

    return (
      <div className="context-menu-container ref-output-editor output-edit">

        <div className="dms-form-control">
          <ContentEditable
            className="dms-output-label"
            value={ label || '' }
            placeholder={ this.translate('Output') }
            singleLine
            onInput={ this.setLabel } />
        </div>

        { this.renderValidation() }

        <div className="dms-form-control">
          <label className="dms-label">
            {
              this.translate('Output Name')
            }
          </label>

          <Input
            className="ref-output-name"
            value={ name || '' }
            onInput={ this.setName } />
        </div>
      </div>
    );
  }
}



function noopTranslate(str) {
  return str;
}
