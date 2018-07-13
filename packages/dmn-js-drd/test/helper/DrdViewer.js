import Manager from 'dmn-js-shared/lib/base/Manager';

import DrdReadOnlyView from 'src/Viewer';


export default class DrdViewer extends Manager {

  _getViewProviders() {

    return [
      {
        id: 'drd',
        constructor: DrdReadOnlyView,
        opens: 'dmn:Definitions'
      }
    ];
  }

}