import InputSelect from 'dmn-js-shared/lib/components/InputSelect';

import { withChangeSupport } from '../../../util/withChangeSupport';

import {
  getDecisionLiteralExpression,
  getExpressionLanguage,
  shouldDisplayExpressionLanguage
} from '../ExpressionLanguageUtil';

const EXPRESSION_LANGUAGE_ID = 'dmn-boxed-expression-expression-language';

// the variable of the element is displayed first
const LOW_PRIORITY = 500;

export class ExpressionLanguageEditorComponentProvider {
  static $inject = [ 'components', 'viewer', 'expressionLanguages' ];

  constructor(components, viewer, expressionLanguages) {
    const component = withChangeSupport(
      ExpressionLanguageEditorComponent,
      () => [ getDecisionLiteralExpression(viewer) ]
    );

    components.onGetComponent('footer', LOW_PRIORITY, () => {
      const literalExpression = getDecisionLiteralExpression(viewer);

      if (
        literalExpression &&
        shouldDisplayExpressionLanguage(literalExpression, expressionLanguages)
      ) {
        return component;
      }
    });
  }
}

function ExpressionLanguageEditorComponent(_, context) {
  const translate = context.injector.get('translate');
  const viewer = context.injector.get('viewer');
  const literalExpressionEditor = context.injector.get('literalExpression');
  const expressionLanguages = context.injector.get('expressionLanguages');

  const literalExpression = getDecisionLiteralExpression(viewer);

  const expressionLanguage = getExpressionLanguage(literalExpression, expressionLanguages);

  const onChange = value => {
    literalExpressionEditor.setExpressionLanguage(literalExpression, value);
  };

  return (
    <div className="element-expression-language">
      <label
        className="element-expression-language-label"
        htmlFor={ EXPRESSION_LANGUAGE_ID }
      >
        { translate('Expression language') }
      </label>
      <InputSelect
        id={ EXPRESSION_LANGUAGE_ID }
        value={ expressionLanguage }
        options={ expressionLanguages.getAll() }
        onChange={ onChange }
      />
    </div>
  );
}
