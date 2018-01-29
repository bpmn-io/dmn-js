/* eslint-disable max-len */

// eslint-disable-next-line
import Inferno from 'inferno';

import SelectComponent from 'dmn-js-shared/lib/components/SelectComponent';

import { isInput } from 'dmn-js-shared/lib/util/ModelUtil';

const INPUT_EXPRESSION_LANGUAGE_OPTIONS = [{
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

export default class ExpressionLanguage {
  constructor(components, elementRegistry, modeling) {
    this._modeling = modeling;

    components.onGetComponent('context-menu-additional', (context = {}) => {
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
          || (isInput(element.col) ? 'feel' : 'juel');

        return (
          <div className="context-menu-group context-menu-group-cell">
            <h4 className="context-menu-group-title">Cell</h4>
            <div
              className="context-menu-group-entry context-menu-entry-set-expression-language">
              <div>
                <span className="context-menu-group-entry-icon dmn-icon-file-code"></span>
                Expression Language
              </div>

              <SelectComponent
                className="expression-language display-block full-width margin-top-medium"
                onChange={ value => this.onChange(element, value) }
                options={ INPUT_EXPRESSION_LANGUAGE_OPTIONS }
                value={ expressionLanguage } />

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

ExpressionLanguage.$inject = [ 'components', 'elementRegistry', 'modeling' ];