import Manager from 'dmn-js-shared/lib/base/Manager';
import { isAny } from 'dmn-js-shared/lib/util/ModelUtil';

import { Viewer } from 'src';


export default class LiteralExpressionViewer extends Manager {

  _getViewProviders() {

    return [
      {
        id: 'literalExpression',
        constructor: Viewer,
        opens(element) {
          return isAny(element, [ 'dmn:Decision', 'dmn:BusinessKnowledgeModel' ]);
        }
      }
    ];
  }

}