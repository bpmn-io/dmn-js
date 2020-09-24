import { Component } from 'inferno';

import ContentEditable from 'dmn-js-shared/lib/components/ContentEditable';
import Input from 'dmn-js-shared/lib/components/Input';
import InputSelect from 'dmn-js-shared/lib/components/InputSelect';

export default class InputEditor extends Component {

  constructor(props, context) {
    super(props, context);

    this.translate = context.injector ? context.injector.get('translate') : noopTranslate;

    const defaultExpressionLanguage = props.defaultExpressionLanguage.value;

    this.setExpressionLanguage = (expressionLanguage) => {
      this.handleChange({ expressionLanguage });
    };

    this.handleValue = (text) => {

      let { expressionLanguage } = this.props;

      let change = { text };

      if (isMultiLine(text) && !expressionLanguage) {
        change.expressionLanguage = defaultExpressionLanguage;
      }

      if (!isMultiLine(text) && expressionLanguage === defaultExpressionLanguage) {
        change.expressionLanguage = undefined;
      }

      this.handleChange(change);
    };

    this.handleLanguageChange = (language) => {
      this.setExpressionLanguage(language);
    };

    this.handleLabelChange = (value) => {

      // default to <undefined> for empty string
      var label = value || undefined;

      this.handleChange({ label });
    };

    this.handleInputVariableChange = (value) => {

      // default to <undefined> for empty string
      var inputVariable = value || undefined;

      this.handleChange({ inputVariable });
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
      expressionLanguage,
      expressionLanguages,
      inputVariable,
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

        <div className="dms-form-control">
          <label className="dms-label">
            {
              this.translate('Expression Language')
            }
          </label>

          <InputSelect
            className="ref-language"
            value={ expressionLanguage || '' }
            onChange={ this.handleLanguageChange }
            options={ expressionLanguages } />
        </div>

        <div className="dms-form-control">
          <label className="dms-label">
            {
              this.translate('Input Variable')
            }
          </label>

          <Input
            className="ref-input-variable"
            value={ inputVariable || '' }
            onInput={ this.handleInputVariableChange }
            placeholder={ this.translate('cellInput') } />
        </div>
      </div>
    );
  }
}

function isMultiLine(text) {
  return text && text.split(/\n/).length > 1;
}

function noopTranslate(str) {
  return str;
}
