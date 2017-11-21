import EditingManager from './base/Manager';

import DrdModeler from 'dmn-js-drd/lib/Modeler';

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
      }
    ];

  }
}