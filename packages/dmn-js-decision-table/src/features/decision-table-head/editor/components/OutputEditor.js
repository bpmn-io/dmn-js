import { Component } from 'inferno';

import ContentEditable from 'dmn-js-shared/lib/components/ContentEditable';
import ValidatedInput from 'dmn-js-shared/lib/components/ValidatedInput';


export default class OutputEditor extends Component {

  constructor(props, context) {
    super(props, context);

    this.translate = context.injector ? context.injector.get('translate') : noopTranslate;

    this.setLabel = (label) => {
      label = label || undefined;

      this.handleChange({ label });
    };

    this.state = {
      name: props.name
    };

  }


  handleChange(changes) {
    var { onChange } = this.props;

    if (typeof onChange === 'function') {
      onChange(changes);
    }
  }

  onNameInput = ({ isValid, value }) => {

    const name = value || undefined;

    this.setState({ name });

    if (isValid) {
      this.handleChange({ name });
    }
  }

  render() {

    const {
      label
    } = this.props;

    const {
      name
    } = this.state;

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

          <ValidatedInput
            className="ref-output-name"
            value={ name || '' }
            onInput={ this.onNameInput }
            type="text"
            validate={ value => {
              if (/\s/g.test(value)) {
                return 'Output name must not contain whitespaces.';
              }
            } }
          />
        </div>
      </div>
    );
  }
}



function noopTranslate(str) {
  return str;
}