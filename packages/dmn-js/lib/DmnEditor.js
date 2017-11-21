import Manager from './Manager';

import DrdEditor from 'dmn-js-drd/lib/Editor';

/**
 * The dmn editor.
 */
export default class DmnEditor extends Manager {

  constructor(options) {
    super(options);
  }

  getViewProviders() {

    return [
      {
        id: 'drd',
        constructor: DrdEditor,
        opens: 'dmn:Definitions'
      }
    ];

  }
}