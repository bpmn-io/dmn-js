import { Component } from 'inferno';

import { isString } from 'min-dash';

import ContentEditable from 'dmn-js-shared/lib/components/ContentEditable';
import Input from 'dmn-js-shared/lib/components/Input';
import InputSelect from 'dmn-js-shared/lib/components/InputSelect';

export default class InputEditor extends Component {

  constructor(props, context) {
    super(props, context);

    const { defaultExpressionLanguage } = this.props;

    this.setExpressionLanguage = (expressionLanguage) => {
      this.handleChange({ expressionLanguage });
    };

    this.handleValue = (text) => {

      let { expressionLanguage } = this.props;

      let change = { text };

      if (!expressionLanguage) {
        change.expressionLanguage = defaultExpressionLanguage;
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
      defaultExpressionLanguage,
      expressionLanguageOptions,
      inputVariable,
      label,
      text
    } = this.props;

    const languageOptions = [
      ...new Set([defaultExpressionLanguage].concat(expressionLanguageOptions))
    ].filter(isString).map(o => ({ label: o, value: o }));

    return (
      <div className="dms-container ref-input-editor">

        <p className="dms-fill-row">
          <label className="dms-label">Input Label</label>

          <Input
            className="ref-input-label"
            value={ label || '' }
            onInput={ this.handleLabelChange } />
        </p>

        <hr className="dms-hrule" />

        <h4 className="dms-heading">Input Expression</h4>

        <ContentEditable
          placeholder="enter expression"
          ctrlForNewline={ true }
          className={
            [
              'ref-text',
              'dms-input',
              'dms-script-input script-editor',
              'dms-fit-row'
            ].join(' ')
          }
          onInput={ this.handleValue }
          value={ text || '' } />

        <p className="dms-hint">Enter script.</p>

        <p>
          <label className="dms-label">Expression Language</label>

          <InputSelect
            className="ref-language"
            value={ expressionLanguage || defaultExpressionLanguage }
            onChange={ this.handleLanguageChange }
            options={ languageOptions } />
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
