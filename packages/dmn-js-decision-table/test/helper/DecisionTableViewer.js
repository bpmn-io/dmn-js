import Manager from 'dmn-js/lib/base/Manager';

import Viewer from '../../lib/Viewer';


export default class DecisionTableViewer extends Manager {

  _getViewProviders() {

    return [
      {
        id: 'decisionTable',
        constructor: Viewer,
        opens(element) {
          return element.$type === 'dmn:Decision' && element.decisionTable;
        }
      }
    ];
  }

}