import EditingManager from 'dmn-js-shared/lib/base/EditingManager';

import DrdModelerView from 'lib/Modeler';


export default class DrdModeler extends EditingManager {

  _getViewProviders() {

    return [
      {
        id: 'drd',
        constructor: DrdModelerView,
        opens: 'dmn:Definitions'
      }
    ];
  }

}