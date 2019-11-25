import { Component } from 'inferno';

import Input from 'dmn-js-shared/lib/components/Input';


export default class OutputEditor extends Component {

  constructor(props, context) {
    super(props, context);

    this.setName = (name) => {
      name = name || undefined;

      this.handleChange({ name });
    };

    this.setLabel = (label) => {
      label = label || undefined;

      this.handleChange({ label });
    };

    const { injector } = context;
    if (injector) {
      this.translate = this.translate ? this.translate : injector.get('translate');
    }
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
      <div className="dms-container ref-output-editor">
        <p className="dms-fill-row">
          <label className="dms-label">
            {
              this.translate
                ?
                this.translate('Output Label')
                :
                'Output Label'
            }
          </label>

          <Input
            className="ref-output-label"
            value={ label || '' }
            onInput={ this.setLabel } />
        </p>

        <p className="dms-fill-row">
          <label className="dms-label">
            {
              this.translate
                ?
                this.translate('Output Name')
                :
                'Output Name'
            }
          </label>

          <Input
            className="ref-output-name"
            value={ name || '' }
            onInput={ this.setName } />
        </p>

      </div>
    );
  }
}
