/* eslint-disable max-len */

import InputSelect from 'dmn-js-shared/lib/components/InputSelect';

import { isInput } from 'dmn-js-shared/lib/util/ModelUtil';


export default class ExpressionLanguage {
  constructor(components, elementRegistry, modeling, expressionLanguages, translate) {
    this._modeling = modeling;
    this._translate = translate;

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

        const expressionLanguage = element.businessObject.expressionLanguage
          || expressionLanguages.getDefault(isInput(element.col) ? 'inputCell' : 'outputCell').value;

        const options = expressionLanguages.getAll();

        return (
          <div
            className="context-menu-group-entry context-menu-entry-set-expression-language">
            <div>
              <span className="context-menu-group-entry-icon dmn-icon-file-code"></span>
              { this._translate('Expression Language') }
            </div>

            <InputSelect
              className="expression-language"
              onChange={ value => this.onChange(element, value) }
              options={ options }
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

ExpressionLanguage.$inject = [
  'components',
  'elementRegistry',
  'modeling',
  'expressionLanguages',
  'translate'
];
