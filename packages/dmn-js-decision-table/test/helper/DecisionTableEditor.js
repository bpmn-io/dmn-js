import EditingManager from 'dmn-js/lib/base/EditingManager';

import DecisionTableEditorConstructor from '../../lib/DecisionTableEditor';


export default class DecisionTableEditor extends EditingManager {

  _getViewProviders() {

    return [
      {
        id: 'decisionTable',
        constructor: DecisionTableEditorConstructor,
        opens(element) {
          return element.$type === 'dmn:Decision' && element.decisionTable;
        }
      }
    ];
  }

}