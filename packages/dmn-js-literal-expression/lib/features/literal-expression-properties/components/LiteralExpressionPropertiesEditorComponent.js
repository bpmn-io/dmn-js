import { Component } from 'inferno';

import Input from 'dmn-js-shared/lib/components/Input';
import InputSelect from 'dmn-js-shared/lib/components/InputSelect';

const EXPRESSION_LANGUAGE_OPTIONS = [{
  label: 'FEEL',
  value: 'feel'
}, {
  label: 'JUEL',
  value: 'juel'
}, {
  label: 'JavaScript',
  value: 'javascript'
}, {
  label: 'Groovy',
  value: 'groovy'
}, {
  label: 'Python',
  value: 'python'
}, {
  label: 'JRuby',
  value: 'jruby'
}];

const TYPE_REF_OPTIONS = [{
  label: 'string',
  value: 'string'
}, {
  label: 'boolean',
  value: 'boolean'
}, {
  label: 'integer',
  value: 'integer'
}, {
  label: 'long',
  value: 'long'
}, {
  label: 'double',
  value: 'double'
}, {
  label: 'date',
  value: 'date'
}];


export default class LiteralExpressionPropertiesComponent extends Component {
  constructor(props, context) {
    super(props, context);

    const viewer = this._viewer = context.injector.get('viewer');
    this._modeling = context.injector.get('modeling');

    const decision = viewer._decision;

    this.state = {
      name: decision.variable.name,
      typeRef: decision.variable.typeRef,
      expressionLanguage: getExpressionLanguage(decision.literalExpression)
    };

    this.setVariableName = this.setVariableName.bind(this);
    this.setVariableType = this.setVariableType.bind(this);
    this.setExpressionLanguage = this.setExpressionLanguage.bind(this);
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

  setExpressionLanguage(expressionLanguage) {
    if (expressionLanguage === '') {
      this._modeling.editExpressionLanguage(undefined);

      this.setState({
        expressionLanguage: undefined
      });
    } else {
      this._modeling.editExpressionLanguage(expressionLanguage);

      this.setState({
        expressionLanguage
      });
    }
  }

  render() {
    let { expressionLanguage, name, typeRef } = this.state;

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
                  options={ TYPE_REF_OPTIONS }
                  value={ typeRef }
                  className="variable-type-select dms-block" />
              </div>
            </td>
          </tr>
          <tr>
            <td>Expression Language:</td>
            <td>
              <div className="dms-fill-row">
                <InputSelect
                  onChange={ this.setExpressionLanguage }
                  options={ EXPRESSION_LANGUAGE_OPTIONS }
                  value={ expressionLanguage }
                  className="expression-language-select dms-block" />
              </div>
            </td>
          </tr>
        </table>
      </div>
    );
  }
}


// helpers //////////////////////

function getExpressionLanguage(literalExpression) {
  return (literalExpression && literalExpression.expressionLanguage)
    ? literalExpression.expressionLanguage.toLowerCase()
    : undefined;
}