import EditingManager from 'dmn-js-shared/lib/base/EditingManager';

import Editor from 'lib/Editor';


export default class LiteralExpressionEditor extends EditingManager {

  _getViewProviders() {

    return [
      {
        id: 'literalExpression',
        constructor: Editor,
        opens(element) {
          return element.$type === 'dmn:Decision' && element.literalExpression;
        }
      }
    ];
  }

}