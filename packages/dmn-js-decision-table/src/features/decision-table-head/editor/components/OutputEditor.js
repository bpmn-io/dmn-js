import { Component } from 'inferno';

import ContentEditable from 'dmn-js-shared/lib/components/ContentEditable';
import Input from 'dmn-js-shared/lib/components/Input';


export default class OutputEditor extends Component {

  constructor(props, context) {
    super(props, context);

    this.translate = context.injector ? context.injector.get('translate') : noopTranslate;

    this.setName = (name) => {
      name = name || undefined;

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

  render() {

    const {
      name,
      label
    } = this.props;

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