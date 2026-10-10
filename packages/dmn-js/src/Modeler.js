import EditingManager from 'dmn-js-shared/lib/base/EditingManager';

import DrdModeler from 'dmn-js-drd/lib/Modeler';
import { Editor as BoxedExpressionEditor } from 'dmn-js-boxed-expression';

import { is, isAny, getBoxedExpression } from 'dmn-js-shared/lib/util/ModelUtil';
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
        id: 'boxedExpression',
        constructor: BoxedExpressionEditor,
        opens(element) {
          return (
            (
              is(element, 'dmn:Decision') &&
              isAny(element.decisionLogic, [
                'dmn:DecisionTable',
                'dmn:LiteralExpression'
              ])
            ) ||
            (
              is(element, 'dmn:BusinessKnowledgeModel') &&
              getBoxedExpression(element)
            )
          );
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
