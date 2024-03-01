import Manager from 'dmn-js-shared/lib/base/Manager';
import View from 'dmn-js-shared/lib/base/View';

import { Viewer } from 'src';


export default class MockViewer extends Manager {

  _getViewProviders() {

    return [ {
      id: 'literalExpression',
      constructor: Viewer,
      opens(element) {
        return (
          element.$type === 'dmn:Decision' &&
          element.decisionLogic &&
          element.decisionLogic.$type === 'dmn:LiteralExpression'
        );
      }
    }, {
      id: 'drd',
      constructor: View,
      opens: 'dmn:Definitions'
    } ];
  }

}