import { Component } from 'inferno';

import ContentEditable from 'dmn-js-shared/lib/components/ContentEditable';


export default class InputExpressionEditor extends Component {

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

    this.handleLanguageChange = (evt) => {
      var language = evt.target.value;

      this.setExpressionLanguage(language);
    };

    this.handleInputVariableChange = (evt) => {

      // default to <null> for undefined
      var inputVariable = evt.target.value || undefined;

      this.handleChange({ inputVariable });
    };

    this.handleKey = (evt) => {
      // enter key
      if (evt.which === 13) {
        this.makeScript();
      }
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
      text
    } = this.props;

    var editScript = expressionLanguage || isMultiLine(text);

    return (
      <div className="dms-container ref-input-expression-editor">

        <h3 className="dms-heading">Edit Input Expression</h3>

        <ContentEditable
          placeholder="enter expression"
          className={
            [
              'ref-text',
              'dms-input',
              editScript ? 'dms-script-input' : '',
              'dms-fit-row'
            ].join(' ')
          }
          onInput={ this.handleValue }
          value={ text } />

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
              <label className="dms-label">Script Language:</label>&nbsp;

              <select
                className="dms-select ref-language"
                value={ expressionLanguage }
                onChange={ this.handleLanguageChange }>

                {
                  isMultiLine(text)
                    ? null
                    : <option value=""></option>
                }
                <option value="FEEL">FEEL</option>
                <option value="JUEL">JUEL</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Groovy">Groovy</option>
              </select>
            </p>
          )
        }

        <p className="dms-fill-row">
          <label className="dms-label">Input Variable:</label>&nbsp;

          <input
            className="dms-input ref-input-variable"
            value={ inputVariable || '' }
            onInput={ this.handleInputVariableChange }
            placeholder="cellInput" />
        </p>

      </div>
    );
  }
}



function isMultiLine(text) {
  return text.split(/\n/).length > 1;
}