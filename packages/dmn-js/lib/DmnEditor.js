import EditingManager from './base/EditingManager';
import View from './base/View';

import DrdModeler from 'dmn-js-drd/lib/Modeler';
import DecisionTableEditor from 'dmn-js-decision-table/lib/DecisionTableEditor';


/**
 * The dmn editor.
 */
export default class DmnEditor extends EditingManager {

  _getViewProviders() {

    return [
      {
        id: 'drd',
        constructor: DrdModeler,
        opens: 'dmn:Definitions'
      },
      {
        id: 'decision',
        constructor: DecisionTableEditor,
        opens(element) {
          return element.$type === 'dmn:Decision' && element.decisionTable;
        }
      }
    ];

  }
}