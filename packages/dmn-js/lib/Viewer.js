import Manager from 'dmn-js-shared/lib/base/Manager';

import DrdViewer from 'dmn-js-drd/lib/Viewer';
import DecisionTableViewer from 'dmn-js-decision-table/lib/Viewer';
import LiteralExpressionViewer from 'dmn-js-literal-expression/lib/Viewer';

/**
 * The dmn editor.
 */
export default class Viewer extends Manager {

  _getViewProviders() {

    return [
      {
        id: 'drd',
        constructor: DrdViewer,
        opens: 'dmn:Definitions'
      },
      {
        id: 'decisionTable',
        constructor: DecisionTableViewer,
        opens(element) {
          return element.$type === 'dmn:Decision' && element.decisionTable;
        }
      },
      {
        id: 'literalExpression',
        constructor: LiteralExpressionViewer,
        opens(element) {
          return element.$type === 'dmn:Decision' && element.literalExpression;
        }
      }
    ];

  }
}