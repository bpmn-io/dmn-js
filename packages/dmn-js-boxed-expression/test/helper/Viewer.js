import Manager from 'dmn-js-shared/lib/base/Manager';
import { getBoxedExpression, isAny } from 'dmn-js-shared/lib/util/ModelUtil';

import { Viewer } from 'src';


export default class BoxedExpressionViewer extends Manager {

  _getViewProviders() {

    return [
      {
        id: 'boxedExpression',
        constructor: Viewer,
        opens(element) {
          return (
            isAny(element, [ 'dmn:Decision', 'dmn:BusinessKnowledgeModel' ]) &&
            !!getBoxedExpression(element)
          );
        }
      }
    ];
  }

}
