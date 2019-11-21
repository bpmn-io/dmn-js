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

    this.makeScript = (event) => {
      event.preventDefault();
      event.stopPropagation();

      this.setExpressionLanguage(defaultExpressionLanguage);
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
      defaultExpressionLanguage,
      expressionLanguage,
      expressionLanguages,
      inputVariable,
      label,
      text
    } = this.props;

    const editScript = expressionLanguage || isMultiLine(text);

    return (
      <div className="dms-container ref-input-editor">

        <p className="dms-fill-row">
          <label className="dms-label">
            {
              this.translate('Input Label')
            }
          </label>

          <Input
            className="ref-input-label"
            value={ label || '' }
            onInput={ this.handleLabelChange } />
        </p>

        <hr className="dms-hrule" />

        <h4 className="dms-heading">
          {
            this.translate('Input Expression')
          }
        </h4>

        <ContentEditable
          placeholder="enter expression"
          ctrlForNewline={ true }
          className={
            [
              'ref-text',
              'dms-input',
              editScript ? 'dms-script-input script-editor' : '',
              'dms-fit-row'
            ].join(' ')
          }
          onInput={ this.handleValue }
          value={ text || '' } />

        {
          !editScript && (

            // TODO @barmac: Replace with proper i18n tooling
            <p className="dms-hint">
              {
                this.translate('Enter simple')
              }
              <code>{ defaultExpressionLanguage.label }</code>
              {
                this.translate('expression or')
              }
              <button type="button"
                className="ref-make-script"
                onClick={ this.makeScript }>
                {
                  this.translate('change to script.')
                }
              </button>.
            </p>
          )
        }

        {
          editScript && (
            <p className="dms-hint">
              {
                this.translate('Enter script.')
              }
            </p>
          )
        }

        {
          editScript && (
            <p>
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
            </p>
          )
        }

        <p className="dms-fill-row">
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
        </p>
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
