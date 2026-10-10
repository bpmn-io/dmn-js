import { Component } from 'inferno';

import ContentEditable from 'dmn-js-shared/lib/components/ContentEditable';
import LiteralExpression from 'dmn-js-shared/lib/components/LiteralExpression';

export default class InputEditor extends Component {

  constructor(props, context) {
    super(props, context);

    this.translate = context.injector.get('translate');
    this.expressionLanguages = context.injector.get('expressionLanguages', false);
    this.variableResolver = context.injector.get('variableResolver', false);

    this.handleValue = (text) => {

      let change = { text };

      this.handleChange(change);
    };

    this.handleLabelChange = (value) => {

      // default to <undefined> for empty string
      var label = value || undefined;

      this.handleChange({ label });
    };
  }

  handleChange(changes) {
    var { onChange } = this.props;

    if (typeof onChange === 'function') {
      onChange(changes);
    }
  }

  getExpressionEditorComponent() {
    if (this.expressionLanguages &&
      this.expressionLanguages.getDefault('inputCell').value !== 'feel') {
      return ContentEditable;
    }

    return LiteralExpression;
  }

  /**
   * Supress default menu closure on enter.
   * @param {KeyboardEvent} event
   */
  handleKeyDown = event => {
    if (event.key === 'Enter') {
      event.stopPropagation();
    }
  };

  _getVariables() {
    return this.variableResolver &&
      this.variableResolver.getVariables(this.props.element);
  }

  render() {

    const {
      label,
      text
    } = this.props;

    const ExpressionEditor = this.getExpressionEditorComponent();

    const variables = this._getVariables();

    return (
      <div className="context-menu-container ref-input-editor input-edit"
        onKeyDown={ this.handleKeyDown }>

        <div className="dms-form-control">
          <ContentEditable
            label={ this.translate('Input label') }
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

          <ExpressionEditor
            label={ this.translate('Input expression') }
            placeholder={ this.translate('Enter expression') }
            className={
              [
                'ref-text',
                'dms-input'
              ].join(' ')
            }
            onInput={ this.handleValue }
            value={ text || '' }
            variables={ variables } />
        </div>
      </div>
    );
  }
}
