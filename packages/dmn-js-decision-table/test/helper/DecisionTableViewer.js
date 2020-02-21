import Manager from 'dmn-js-shared/lib/base/Manager';

import Viewer from 'src/Viewer';


export default class DecisionTableViewer extends Manager {

  _getViewProviders() {

    return [
      {
        id: 'decisionTable',
        constructor: Viewer,
        opens(element) {
          return (
            element.$type === 'dmn:Decision' &&
            element.decisionLogic &&
            element.decisionLogic.$type === 'dmn:DecisionTable'
          );
        }
      }
    ];
  }

}