import EditingManager from 'dmn-js-shared/lib/base/EditingManager';

import Editor from 'src/Editor';


export default class DecisionTableEditor extends EditingManager {

  _getViewProviders() {

    return [
      {
        id: 'decisionTable',
        constructor: Editor,
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