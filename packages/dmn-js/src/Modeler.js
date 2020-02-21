import EditingManager from 'dmn-js-shared/lib/base/EditingManager';

import DrdModeler from 'dmn-js-drd/lib/Modeler';
import DecisionTableEditor from 'dmn-js-decision-table/lib/Editor';
import LiteralExpressionEditor from 'dmn-js-literal-expression/lib/Editor';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';
import { containsDi } from 'dmn-js-shared/lib/util/DiUtil';


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
          return (
            is(element, 'dmn:Decision') &&
            is(element.decisionLogic, 'dmn:DecisionTable')
          );
        }
      },
      {
        id: 'literalExpression',
        constructor: LiteralExpressionEditor,
        opens(element) {
          return (
            is(element, 'dmn:Decision') &&
            is(element.decisionLogic, 'dmn:LiteralExpression')
          );
        }
      }
    ];

  }

  _getInitialView(views) {

    var definitionsView;

    for (var i = 0; i < views.length; i++) {

      const view = views[i];
      const el = view.element;

      if (is(el, 'dmn:Decision')) {
        return view;
      }

      if (is(el, 'dmn:Definitions')) {
        definitionsView = view;

        if (containsDi(el)) {
          return view;
        }
      }
    }

    return definitionsView || views[0];
  }

}