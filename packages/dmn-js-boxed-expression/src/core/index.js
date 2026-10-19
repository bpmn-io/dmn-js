import ElementFactory from 'table-js/lib/core/ElementFactory';
import ElementRegistry from 'table-js/lib/core/ElementRegistry';
import Sheet from 'table-js/lib/core/Sheet';
import Throttle from 'table-js/lib/core/Throttle';

import DmnFactory from './DmnFactory';
import ImportModule from '../import';

/**
 * Provides the services the decision table is built upon.
 *
 * The `table-js` core module is deliberately not used: it depends on the
 * `table-js` render module, which would replace the renderer, components and
 * change support this view is built on.
 */
export default {
  __depends__: [ ImportModule ],
  __init__: [ 'elementFactory', 'elementRegistry', 'sheet' ],
  dmnFactory: [ 'type', DmnFactory ],
  elementFactory: [ 'type', ElementFactory ],
  elementRegistry: [ 'type', ElementRegistry ],
  sheet: [ 'type', Sheet ],
  throttle: [ 'factory', Throttle ]
};
