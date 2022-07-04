import EditingManager from 'dmn-js-shared/lib/base/EditingManager';

import DrdModeler from 'dmn-js-drd/lib/Modeler';
import DecisionTableEditor from 'dmn-js-decision-table/lib/Editor';
import LiteralExpressionEditor from 'dmn-js-literal-expression/lib/Editor';

import { getBoxedExpression, is } from 'dmn-js-shared/lib/util/ModelUtil';
import { containsDi } from 'dmn-js-shared/lib/util/DiUtil';

import { find } from 'min-dash';


/**
 * The dmn editor.
 */
export default class Modeler extends EditingManager {

  _getViewProviders() {

    return [
      {
        id: 'drd',
        constructor: DrdModeler,
        opens: 'dmn:Definitions'
      },
      {
        id: 'decisionTable',
        constructor: DecisionTableEditor,
        opens(element) {
          const boxedExpression = getBoxedExpression(element);

          return is(boxedExpression, 'dmn:DecisionTable');
        }
      },
      {
        id: 'literalExpression',
        constructor: LiteralExpressionEditor,
        opens(element) {
          const boxedExpression = getBoxedExpression(element);

          return is(boxedExpression, 'dmn:LiteralExpression');
        }
      }
    ];

  }

  _getInitialView(views, ...rest) {
    let initialView = super._getInitialView(views, ...rest);

    if (!initialView) {
      return;
    }

    const element = initialView.element;

    // if initial view is definitions without DI, try to open another view
    if (is(element, 'dmn:Definitions') && !containsDi(element)) {
      initialView =
        find(views, view => !is(view.element, 'dmn:Definitions')) || initialView;
    }

    return initialView;
  }
}
