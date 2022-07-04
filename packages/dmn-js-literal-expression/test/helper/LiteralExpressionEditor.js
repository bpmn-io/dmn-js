import EditingManager from 'dmn-js-shared/lib/base/EditingManager';

import { getBoxedExpression, is } from 'dmn-js-shared/lib/util/ModelUtil';

import Editor from 'src/Editor';


export default class LiteralExpressionEditor extends EditingManager {

  _getViewProviders() {

    return [
      {
        id: 'literalExpression',
        constructor: Editor,
        opens(element) {
          const boxedExpression = getBoxedExpression(element);

          return is(boxedExpression, 'dmn:LiteralExpression');
        }
      }
    ];
  }

}