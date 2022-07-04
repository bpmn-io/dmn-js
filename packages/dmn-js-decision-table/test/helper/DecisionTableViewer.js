import Manager from 'dmn-js-shared/lib/base/Manager';
import { getBoxedExpression, is } from 'dmn-js-shared/lib/util/ModelUtil';

import Viewer from 'src/Viewer';


export default class DecisionTableViewer extends Manager {

  _getViewProviders() {

    return [
      {
        id: 'decisionTable',
        constructor: Viewer,
        opens(element) {
          const boxedExpression = getBoxedExpression(element);

          return is(boxedExpression, 'dmn:DecisionTable');
        }
      }
    ];
  }

}