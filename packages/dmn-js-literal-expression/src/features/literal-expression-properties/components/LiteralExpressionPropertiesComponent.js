import { Component } from 'inferno';

import { getBoxedExpression } from 'dmn-js-shared/lib/util/ModelUtil';

export default class LiteralExpressionPropertiesComponent extends Component {
  constructor(props, context) {
    super(props, context);

    this._viewer = context.injector.get('viewer');
  }

  render() {
    const decision = this._viewer.getDecision();

    const literalExpression = getBoxedExpression(decision);
    const variable = decision.variable;

    return (
      <div className="literal-expression-properties">
        <table>
          <tr>
            <td>Variable Name:</td>
            <td>
              <span>{ variable.name || '-' }</span>
            </td>
          </tr>
          <tr>
            <td>Variable Type:</td>
            <td>
              <span>{ variable.typeRef || '-' }</span>
            </td>
          </tr>
          <tr>
            <td>Expression Language:</td>
            <td>
              <span>{ literalExpression.expressionLanguage || '-' }</span>
            </td>
          </tr>
        </table>
      </div>
    );
  }
}