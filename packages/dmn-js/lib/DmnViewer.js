import Manager from './base/Manager';

import DrdViewer from 'dmn-js-drd/lib/Viewer';
import DecisionTableViewer from 'dmn-js-decision-table/lib/DecisionTable';

/**
 * The dmn editor.
 */
export default class DmnViewer extends Manager {

  _getViewProviders() {

    return [
      {
        id: 'drd',
        constructor: DrdViewer,
        opens: 'dmn:Definitions'
      },
      {
        id: 'decisionTable',
        constructor: DecisionTableViewer,
        opens(element) {
          return element.$type === 'dmn:Decision' && element.decisionTable;
        }
      }
    ];

  }
}