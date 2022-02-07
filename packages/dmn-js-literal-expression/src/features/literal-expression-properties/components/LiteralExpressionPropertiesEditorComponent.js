import { Component } from 'inferno';

import Input from 'dmn-js-shared/lib/components/Input';
import InputSelect from 'dmn-js-shared/lib/components/InputSelect';


export default class LiteralExpressionPropertiesComponent extends Component {
  constructor(props, context) {
    super(props, context);

    this._viewer = context.injector.get('viewer');
    this._modeling = context.injector.get('modeling');
    this._dataTypes = context.injector.get('dataTypes');

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
        label: t,
        value: t
      };
    });

    return (
      <div className="literal-expression-properties">
        <table>
          <tr>
            <td>Variable Name:</td>
            <td>
              <Input
                className="variable-name-input"
                onInput={ this.setVariableName }
                placeholder={ 'name' }
                value={ name || '' } />
            </td>
          </tr>
          <tr>
            <td>Variable Type:</td>
            <td>
              <div className="dms-fill-row">
                <InputSelect
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
        <td>Expression Language:</td>
        <td>
          <div className="dms-fill-row">
            <InputSelect
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
