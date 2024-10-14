import { Component } from 'inferno';

import Input from 'dmn-js-shared/lib/components/Input';
import InputSelect from 'dmn-js-shared/lib/components/InputSelect';


export default class LiteralExpressionPropertiesComponent extends Component {
  constructor(props, context) {
    super(props, context);

    this._translate = context.injector.get('translate');
    this._viewer = context.injector.get('viewer');
    this._modeling = context.injector.get('modeling');
    this._dataTypes = context.injector.get('dataTypes');
    this._eventBus = context.injector.get('eventBus');
    const decision = this._viewer.getDecision();

    this.state = {
      name: decision.variable.name,
      typeRef: decision.variable.typeRef
    };

    this.setVariableName = this.setVariableName.bind(this);
    this.setVariableType = this.setVariableType.bind(this);
  }

  setVariableName(name) {
    this._modeling.editVariableName(name);

    this.setState({
      name
    });
  }

  componentWillMount() {
    this._eventBus.on('elements.changed', this.onChange);
  }

  componentWillUnmount() {
    this._eventBus.off('elements.changed', this.onChange);
  }

  onChange = () => {
    const decision = this._viewer.getDecision();
    if (decision.variable) {
      this.setState({
        name: decision.variable.name
      });
    }
  };

  setVariableType(typeRef) {
    if (typeRef === '') {
      this._modeling.editVariableType(undefined);

      this.setState({
        typeRef: undefined
      });
    } else {
      this._modeling.editVariableType(typeRef);

      this.setState({
        typeRef
      });
    }
  }

  render() {
    const { name, typeRef } = this.state;

    const typeRefOptions = this._dataTypes.getAll().map(t => {
      return {
        label: this._translate(t),
        value: t
      };
    });

    return (
      <div className="literal-expression-properties">
        <table className="variables-table">
          <tr>
            <td>{ this._translate('Variable name:') }</td>
            <td>
              <Input
                label={ this._translate('Variable name') }
                className="variable-name-input"
                onInput={ this.setVariableName }
                placeholder={ this._translate('name') }
                value={ name || '' } />
            </td>
          </tr>
          <tr>
            <td>{ this._translate('Variable type:') }</td>
            <td>
              <div className="dms-fill-row">
                <InputSelect
                  label={ this._translate('Variable type') }
                  onChange={ this.setVariableType }
                  options={ typeRefOptions }
                  value={ typeRef }
                  className="variable-type-select dms-block" />
              </div>
            </td>
          </tr>
          <ExpressionLanguage />
        </table>
      </div>
    );
  }
}

class ExpressionLanguage extends Component {
  constructor(props, context) {
    super(props, context);

    this._translate = context.injector.get('translate');
    this._viewer = context.injector.get('viewer');
    this._modeling = context.injector.get('modeling');
    this._expressionLanguages = context.injector.get('expressionLanguages');

    this.setExpressionLanguage = this.setExpressionLanguage.bind(this);
  }

  setExpressionLanguage(expressionLanguage) {
    if (expressionLanguage === '') {
      this._modeling.editExpressionLanguage(undefined);
    } else {
      this._modeling.editExpressionLanguage(expressionLanguage);
    }
  }

  _getExpressionLanguage() {
    const decision = this._viewer.getDecision();
    const literalExpression = decision.decisionLogic;

    return (literalExpression && literalExpression.expressionLanguage)
      ? literalExpression.expressionLanguage.toLowerCase()
      : this._getDefaultExpressionLanguage();
  }

  _getDefaultExpressionLanguage() {
    return this._expressionLanguages.getDefault().value;
  }

  _shouldRender() {
    const expressionLanguages = this._expressionLanguages.getAll();

    if (expressionLanguages.length > 1) {
      return true;
    }

    const expressionLanguage = this._getExpressionLanguage();

    return expressionLanguage !== this._getDefaultExpressionLanguage();
  }

  render() {
    if (!this._shouldRender()) {
      return null;
    }

    const expressionLanguage = this._getExpressionLanguage();

    const languageOptions = this._expressionLanguages.getAll();

    return (
      <tr>
        <td>{ this._translate('Expression language:') }</td>
        <td>
          <div className="dms-fill-row">
            <InputSelect
              label={ this._translate('Expression language') }
              onChange={ this.setExpressionLanguage }
              options={ languageOptions }
              value={ expressionLanguage }
              className="expression-language-select dms-block" />
          </div>
        </td>
      </tr>
    );
  }
}
