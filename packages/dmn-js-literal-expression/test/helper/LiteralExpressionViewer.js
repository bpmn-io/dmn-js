import Manager from 'dmn-js-shared/lib/base/Manager';

import { getBoxedExpression, is } from 'dmn-js-shared/lib/util/ModelUtil';

import Viewer from 'src/Viewer';


export default class LiteralExpressionViewer extends Manager {

  _getViewProviders() {

    return [
      {
        id: 'literalExpression',
        constructor: Viewer,
        opens(element) {
          const boxedExpression = getBoxedExpression(element);

          return is(boxedExpression, 'dmn:LiteralExpression');
        }
      }
    ];
  }

}