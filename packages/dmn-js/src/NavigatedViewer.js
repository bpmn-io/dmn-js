import Manager from 'dmn-js-shared/lib/base/Manager';

import DrdNavigatedViewer from 'dmn-js-drd/lib/NavigatedViewer';
import DecisionTableViewer from 'dmn-js-decision-table/lib/Viewer';
import LiteralExpressionViewer from 'dmn-js-literal-expression/lib/Viewer';

import { getBoxedExpression, is } from 'dmn-js-shared/lib/util/ModelUtil';
import { containsDi } from 'dmn-js-shared/lib/util/DiUtil';


/**
 * The dmn viewer.
 */
export default class Viewer extends Manager {

  _getViewProviders() {

    return [
      {
        id: 'drd',
        constructor: DrdNavigatedViewer,
        opens(element) {
          return is(element, 'dmn:Definitions') && containsDi(element);
        }
      },
      {
        id: 'decisionTable',
        constructor: DecisionTableViewer,
        opens(element) {
          const boxedExpression = getBoxedExpression(element);

          return is(boxedExpression, 'dmn:DecisionTable');
        }
      },
      {
        id: 'literalExpression',
        constructor: LiteralExpressionViewer,
        opens(element) {
          const boxedExpression = getBoxedExpression(element);

          return is(boxedExpression, 'dmn:LiteralExpression');
        }
      }
    ];

  }

}