import { Component } from 'inferno';

import { isString } from 'min-dash';

import ContentEditable from 'dmn-js-shared/lib/components/ContentEditable';
import Input from 'dmn-js-shared/lib/components/Input';
import InputSelect from 'dmn-js-shared/lib/components/InputSelect';

const DEFAULT_EXPRESSION_LANGUAGE = 'JUEL';

export default class InputEditor extends Component {

  constructor(props, context) {
    super(props, context);

    this.setExpressionLanguage = (expressionLanguage) => {
      this.handleChange({ expressionLanguage });
    };

    this.makeScript = (event) => {
      event.preventDefault();
      event.stopPropagation();

      this.setExpressionLanguage(DEFAULT_EXPRESSION_LANGUAGE);
    };

    this.handleValue = (text) => {

      let { expressionLanguage } = this.props;

      let change = { text };

      if (isMultiLine(text) && !expressionLanguage) {
        change.expressionLanguage = DEFAULT_EXPRESSION_LANGUAGE;
      }

      if (!isMultiLine(text) && expressionLanguage === DEFAULT_EXPRESSION_LANGUAGE) {
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
      inputVariable,
      label,
      text
    } = this.props;

    const { injector } = this.context;

    var editScript = expressionLanguage || isMultiLine(text);

    var languageOptions = [
      !isMultiLine(text) && '',
      'FEEL',
      'JUEL',
      'JavaScript',
      'Groovy',
      'Python'
    ].filter(isString).map(o => ({ label: o, value: o }));

    if (injector) {
      this.translate = this.translate ? this.translate : injector.get('translate');
    }

    return (
      <div className="dms-container ref-input-editor">

        <p className="dms-fill-row">
          <label className="dms-label">
            {
              this.translate
                ?
                this.translate('Input Label') || 'Input Label'
                :
                'Input Label'
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
            this.translate
              ?
              this.translate('Input Expression') || 'Input Expression'
              :
              'Input Expression'
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
            <p className="dms-hint">
              {
                this.translate
                  ?
                  this.translate('Enter') || 'Enter'
                  + this.translate('simple') || 'simple'
                  :
                  'Enter simple'
              }
              <code>{ DEFAULT_EXPRESSION_LANGUAGE }</code>
              {
                this.translate
                  ?
                  this.translate('expression') || 'expression'
                  + this.translate('or') || 'or'
                  :
                  'expression or'
              }
              <button type="button"
                className="ref-make-script"
                onClick={ this.makeScript }>
                {
                  this.translate
                    ?
                    this.translate('change to script') || 'change to script'
                    :
                    'change to script'
                }
              </button>.
            </p>
          )
        }

        {
          editScript && (
            <p className="dms-hint">
              {
                this.translate
                  ?
                  this.translate('Enter script') || 'Enter script.'
                  :
                  'Enter script.'
              }
            </p>
          )
        }

        {
          editScript && (
            <p>
              <label className="dms-label">
                {
                  this.translate
                    ?
                    this.translate('Expression Language') || 'Expression Language'
                    :
                    'Expression Language'
                }
              </label>

              <InputSelect
                className="ref-language"
                value={ expressionLanguage || '' }
                onChange={ this.handleLanguageChange }
                options={ languageOptions } />
            </p>
          )
        }

        <p className="dms-fill-row">
          <label className="dms-label">
            {
              this.translate
                ?
                this.translate('Input Variable') || 'Input Variable'
                :
                'Input Variable'
            }
          </label>

          <Input
            className="ref-input-variable"
            value={ inputVariable || '' }
            onInput={ this.handleInputVariableChange }
            placeholder="cellInput" />
        </p>
      </div>
    );
  }
}



function isMultiLine(text) {
  return text && text.split(/\n/).length > 1;
}
