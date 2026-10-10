import EditingManager from 'dmn-js-shared/lib/base/EditingManager';
import { getBoxedExpression, isAny } from 'dmn-js-shared/lib/util/ModelUtil';

import { Editor } from 'src';


export default class BoxedExpressionEditor extends EditingManager {

  _getViewProviders() {

    return [
      {
        id: 'boxedExpression',
        constructor: Editor,
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
