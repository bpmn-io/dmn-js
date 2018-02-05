import Manager from 'dmn-js-shared/lib/base/Manager';

import Viewer from 'lib/Viewer';


export default class LiteralExpressionViewer extends Manager {

  _getViewProviders() {

    return [
      {
        id: 'literalExpression',
        constructor: Viewer,
        opens(element) {
          return element.$type === 'dmn:Decision' && element.literalExpression;
        }
      }
    ];
  }

}