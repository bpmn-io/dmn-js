import Manager from 'dmn-js/lib/base/Manager';

import DecisionTableConstructor from '../../lib/DecisionTable';


export default class DecisionTable extends Manager {

  _getViewProviders() {

    return [
      {
        id: 'decisionTable',
        constructor: DecisionTableConstructor,
        opens(element) {
          return element.$type === 'dmn:Decision' && element.decisionTable;
        }
      }
    ];
  }

}