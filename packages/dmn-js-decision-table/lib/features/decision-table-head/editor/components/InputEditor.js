import { Component } from 'inferno';

import { isString } from 'min-dash';

import ContentEditable from 'dmn-js-shared/lib/components/ContentEditable';
import Input from 'dmn-js-shared/lib/components/Input';
import InputSelect from 'dmn-js-shared/lib/components/InputSelect';


export default class InputEditor extends Component {

  constructor(props, context) {
    super(props, context);

    this.setExpressionLanguage = (expressionLanguage) => {
      this.handleChange({ expressionLanguage });
    };

    this.makeScript = (event) => {
      event.preventDefault();
      event.stopPropagation();

      this.setExpressionLanguage('FEEL');
    };

    this.handleValue = (text) => {

      let { expressionLanguage } = this.props;

      let change = { text };

      if (isMultiLine(text) && !expressionLanguage) {
        change.expressionLanguage = 'FEEL';
      }

      if (!isMultiLine(text) && expressionLanguage === 'FEEL') {
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

    var editScript = expressionLanguage || isMultiLine(text);

    var languageOptions = [
      !isMultiLine(text) && '',
      'FEEL',
      'JUEL',
      'JavaScript',
      'Groovy',
      'Python'
    ].filter(isString).map(o => ({ label: o, value: o }));

    return (
      <div className="dms-container ref-input-editor">

        <h4 className="dms-heading">Input Expression</h4>

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
              Enter simple <code>FEEL</code> expression or <a href="#"
                className="ref-make-script"
                onClick={ this.makeScript }>
                  change to script
              </a>.
            </p>
          )
        }

        {
          editScript && (
            <p className="dms-hint">
              Enter script.
            </p>
          )
        }

        {
          editScript && (
            <p>
              <label className="dms-label">Expression Language</label>

              <InputSelect
                className="ref-language"
                value={ expressionLanguage || '' }
                onChange={ this.handleLanguageChange }
                options={ languageOptions } />
            </p>
          )
        }

        <hr className="dms-hrule" />

        <p className="dms-fill-row">
          <label className="dms-label">Input Label</label>

          <Input
            className="ref-input-label"
            value={ label || '' }
            onInput={ this.handleLabelChange } />
        </p>

        <p className="dms-fill-row">
          <label className="dms-label">Input Variable</label>

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