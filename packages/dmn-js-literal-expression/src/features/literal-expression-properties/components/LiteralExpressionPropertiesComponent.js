import { Component } from 'inferno';


export default class LiteralExpressionPropertiesComponent extends Component {
  constructor(props, context) {
    super(props, context);

    this._translate = context.injector.get('translate');
    this._viewer = context.injector.get('viewer');
  }

  render() {
    const {
      decisionLogic: literalExpression,
      variable
    } = this._viewer.getDecision();

    return (
      <div className="literal-expression-properties">
        <table>
          <tr>
            <td>{ this._translate('Variable name:') }</td>
            <td>
              <span>{ variable.name || '-' }</span>
            </td>
          </tr>
          <tr>
            <td>{ this._translate('Variable type:') }</td>
            <td>
              <span>{ this._translate(variable.typeRef || '') || '-' }</span>

            </td>
          </tr>
          <tr>
            <td>{ this._translate('Expression language:') }</td>
            <td>
              <span>{ literalExpression.expressionLanguage || '-' }</span>
            </td>
          </tr>
        </table>
      </div>
    );
  }
}