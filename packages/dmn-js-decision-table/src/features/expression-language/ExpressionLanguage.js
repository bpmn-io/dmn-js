/* eslint-disable max-len */

import InputSelect from 'dmn-js-shared/lib/components/InputSelect';

import { isInput } from 'dmn-js-shared/lib/util/ModelUtil';


export default class ExpressionLanguage {
  constructor(components, elementRegistry, modeling, expressionLanguages, translate, contextMenu) {
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

        const openMenu = event => {
          contextMenu.open({
            x: event.pageX,
            y: event.pageY
          }, {
            contextMenuType: 'expression-language',
            id
          });
        };

        return (
          <div
            className="context-menu-group-entry"
            onClick={ openMenu }
          >
            { this._translate('Change Cell Expression Language') }
          </div>
        );

      }
    });

    components.onGetComponent('context-menu', (context = {}) => {
      if (context.contextMenuType && context.contextMenuType === 'expression-language') {

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

        return () => (
          <div
            className="context-menu-flex">
            <div className="context-menu-group">
              <div className="context-menu-group-entry context-menu-entry-set-expression-language">
                <div>
                  { this._translate('Expression Language') }
                </div>

                <InputSelect
                  className="expression-language"
                  onChange={ value => this.onChange(element, value) }
                  options={ options }
                  value={ expressionLanguage } />
              </div>
            </div>
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
  'translate',
  'contextMenu'
];
