import Manager from './base/Manager';

import DrdViewer from 'dmn-js-drd/lib/Viewer';

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
      }
    ];

  }
}