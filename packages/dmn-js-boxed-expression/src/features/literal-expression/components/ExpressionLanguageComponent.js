import {
  getDecisionLiteralExpression,
  getExpressionLanguage,
  shouldDisplayExpressionLanguage
} from '../ExpressionLanguageUtil';

// the variable of the element is displayed first
const LOW_PRIORITY = 500;

export class ExpressionLanguageComponentProvider {
  static $inject = [ 'components', 'viewer', 'expressionLanguages' ];

  constructor(components, viewer, expressionLanguages) {
    components.onGetComponent('footer', LOW_PRIORITY, () => {
      const literalExpression = getDecisionLiteralExpression(viewer);

      if (
        literalExpression &&
        shouldDisplayExpressionLanguage(literalExpression, expressionLanguages)
      ) {
        return ExpressionLanguageComponent;
      }
    });
  }
}

function ExpressionLanguageComponent(_, context) {
  const translate = context.injector.get('translate');
  const viewer = context.injector.get('viewer');
  const expressionLanguages = context.injector.get('expressionLanguages');

  const literalExpression = getDecisionLiteralExpression(viewer);

  const expressionLanguage = getExpressionLanguage(literalExpression, expressionLanguages);

  return (
    <div className="element-expression-language">
      <span className="element-expression-language-label">
        { translate('Expression language') }
      </span>
      <span>
        { expressionLanguages.getLabel(expressionLanguage) }
      </span>
    </div>
  );
}
