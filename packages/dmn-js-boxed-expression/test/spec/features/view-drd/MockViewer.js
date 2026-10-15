import Manager from 'dmn-js-shared/lib/base/Manager';
import View from 'dmn-js-shared/lib/base/View';
import { getBoxedExpression } from 'dmn-js-shared/lib/util/ModelUtil';

import { Viewer } from 'src';


export default class MockViewer extends Manager {

  _getViewProviders() {

    return [ {
      id: 'boxedExpression',
      constructor: Viewer,
      opens(element) {
        return element.$type === 'dmn:Decision' && !!getBoxedExpression(element);
      }
    }, {
      id: 'drd',
      constructor: View,
      opens: 'dmn:Definitions'
    } ];
  }

}