/* eslint-disable max-len */

import InputSelect from 'dmn-js-shared/lib/components/InputSelect';

import { isInput } from 'dmn-js-shared/lib/util/ModelUtil';

const DEFAULT_INPUT_EXPRESSION_LANGUAGE_OPTIONS = ['FEEL', 'JUEL', 'JavaScript', 'Groovy', 'Python', 'JRuby'];
const DEFAULT_HEADER_AND_OUTPUT_EXPRESSION_LANGUAGE_OPTIONS = ['JUEL', 'JavaScript', 'Groovy', 'Python', 'JRuby'];

export default class ExpressionLanguage {
  constructor(components, elementRegistry, modeling) {
    this._modeling = modeling;

    components.onGetComponent('context-menu-cell-additional', (context = {}) => {
      if (context.contextMenuType && context.contextMenuType === 'context-menu') {

        const { id } = context;

        if (!id) {
          return;
        }

        const element = elementRegistry.get(id);

        // element might not be in element registry (e.g. cut)
        if (!element) {
          return;
        }

        // this needs to come from somewhere
        const configOptions = {};
        const {
          defaultInputExpressionLanguage = 'FEEL',
          defaultHeaderAndOutputExpressisonLanguage = 'JUEL',
          inputExpressionLanguageOptions = DEFAULT_INPUT_EXPRESSION_LANGUAGE_OPTIONS,
          headerAndOutputExpressionLanguageOptions = DEFAULT_HEADER_AND_OUTPUT_EXPRESSION_LANGUAGE_OPTIONS
        } = configOptions;

        const elementIsInput = isInput(element.col);

        const expressionLanguage = element.businessObject.expressionLanguage
          || (elementIsInput ? defaultInputExpressionLanguage : defaultHeaderAndOutputExpressisonLanguage).toLowerCase();

        const expressionLanguageOptions = (elementIsInput ? inputExpressionLanguageOptions : headerAndOutputExpressionLanguageOptions)
          .map(label => ({
            label,
            value: label.toLowerCase()
          }));

        return (
          <div
            className="context-menu-group-entry context-menu-entry-set-expression-language">
            <div>
              <span className="context-menu-group-entry-icon dmn-icon-file-code"></span>
              Expression Language
            </div>

            <InputSelect
              className="expression-language"
              onChange={ value => this.onChange(element, value) }
              options={ expressionLanguageOptions }
              value={ expressionLanguage } />

          </div>
        );

      }
    });
  }

  onChange(cell, expressionLanguage) {
    this._modeling.editExpressionLanguage(cell.businessObject, expressionLanguage);
  }
}

ExpressionLanguage.$inject = [ 'components', 'elementRegistry', 'modeling' ];