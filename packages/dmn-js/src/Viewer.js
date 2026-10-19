import Manager from 'dmn-js-shared/lib/base/Manager';

import DrdViewer from 'dmn-js-drd/lib/Viewer';
import { Viewer as BoxedExpressionViewer } from 'dmn-js-boxed-expression';

import { is, isAny, getBoxedExpression } from 'dmn-js-shared/lib/util/ModelUtil';
import { containsDi } from 'dmn-js-shared/lib/util/DiUtil';


/**
 * The dmn viewer.
 */
export default class Viewer extends Manager {

  _getViewProviders() {

    return [
      {
        id: 'drd',
        constructor: DrdViewer,
        opens(element) {
          return is(element, 'dmn:Definitions') && containsDi(element);
        }
      },
      {
        id: 'boxedExpression',
        constructor: BoxedExpressionViewer,
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

}