// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

import Input from 'dmn-js-shared/lib/components/Input';
import SelectComponent from 'dmn-js-shared/lib/components/SelectComponent';

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
      variableName: getVariableName(decision.variable),
      variableType: getVariableType(decision.variable),
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
    this._modeling.editVariableType(typeRef);

    this.setState({
      typeRef
    });
  }

  setExpressionLanguage(expressionLanguage) {
    this._modeling.editExpressionLanguage(expressionLanguage);

    this.setState({
      expressionLanguage
    });
  }

  render() {
    let { expressionLanguage } = this.state;

    const { variable } = this._viewer._decision;

    return  (
      <div className="literal-expression-properties">
        <table>
          <tr>
            <td>Variable Name:</td>
            <td>
              <Input
                onInput={ this.setVariableName }
                value={ variable.name || '' } />
            </td>
          </tr>
          <tr>
            <td>Variable Type:</td>
            <td>
              <SelectComponent
                className="full-width"
                onChange={ this.setVariableType }
                options={ TYPE_REF_OPTIONS }
                value={ variable.typeRef || '' } />
            </td>
          </tr>
          <tr>
            <td>Expression Language:</td>
            <td>
              <SelectComponent
                className="full-width"
                onChange={ this.setExpressionLanguage }
                options={ EXPRESSION_LANGUAGE_OPTIONS }
                value={ expressionLanguage || 'feel' } />
            </td>
          </tr>
        </table>
      </div>
    );
  }
}

////////// helpers //////////

function getVariableName(variable) {
  return variable
    ? variable.name
    : '';
}

function getVariableType(variable) {
  return variable
    ? variable.typeRef
    : 'string';
}

function getExpressionLanguage(literalExpression) {
  return (literalExpression && literalExpression.expressionLanguage)
    ? literalExpression.expressionLanguage.toLowerCase()
    : 'feel';
}