import InputSelect from 'dmn-js-shared/lib/components/InputSelect';

import {
  getBusinessObject,
  isInput
} from 'dmn-js-shared/lib/util/ModelUtil';


export default class ExpressionLanguage {
  constructor(
      components, elementRegistry, modeling, expressionLanguages,
      translate, contextMenu) {
    this._modeling = modeling;
    this._translate = translate;
    this._expressionLanguages = expressionLanguages;

    components.onGetComponent('context-menu-cell-additional', (context = {}) => {
      if (context.contextMenuType && context.contextMenuType === 'context-menu') {

        const {
          event,
          id
        } = context;

        if (!id) {
          return;
        }

        const element = elementRegistry.get(id);

        // element might not be in element registry (e.g. cut)
        if (!element) {
          return;
        }

        if (!this._shouldDisplayContextMenuEntry(element)) {
          return;
        }

        const openMenu = clickEvent => {
          contextMenu.open({
            x: (event || clickEvent).pageX,
            y: (event || clickEvent).pageY
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
            { this._translate('Change cell expression language') }
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

        const expressionLanguage = this._getElementExpressionLanguage(element);

        const options = expressionLanguages.getAll();

        const className = 'context-menu-group-entry ' +
          'context-menu-entry-set-expression-language';

        const label = this._translate('Expression language');

        return () => (
          <div
            className="context-menu-flex">
            <div className="context-menu-group">
              <div
                className={ className }>
                <div>
                  { label }
                </div>

                <InputSelect
                  label={ label }
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

    components.onGetComponent('context-menu', (context = {}) => {
      if (
        context.contextMenuType === 'input-edit'
      ) {
        return () => {
          const { inputExpression } = context.input;

          if (!this._shouldDisplayContextMenuEntry(inputExpression)) {
            return;
          }

          const expressionLanguage = this._getElementExpressionLanguage(inputExpression);

          const options = expressionLanguages.getAll();

          const label = this._translate('Expression language');

          return <div className="context-menu-container ref-language">
            <div className="dms-form-control">
              <label className="dms-label">
                {
                  label
                }
              </label>

              <InputSelect
                label={ label }
                className="ref-language"
                value={ expressionLanguage || '' }
                onChange={ value => this.onChange(inputExpression, value) }
                options={ options } />
            </div>
          </div>;
        };
      }
    });
  }

  onChange(element, expressionLanguage) {
    this._modeling.editExpressionLanguage(element, expressionLanguage);
  }

  _shouldDisplayContextMenuEntry(element) {
    const expressionLanguages = this._expressionLanguages.getAll();

    if (expressionLanguages.length > 1) {
      return true;
    }

    const expressionLanguage = this._getElementExpressionLanguage(element);

    return expressionLanguage !== this._getDefaultElementExpressionLanguage(element);
  }

  _getElementExpressionLanguage(element) {
    return getBusinessObject(element).expressionLanguage
    || this._getDefaultElementExpressionLanguage(element);
  }

  _getDefaultElementExpressionLanguage(element) {
    return this._expressionLanguages.getDefault(
      isInput(element.col) ? 'inputCell' : 'outputCell').value;
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
