import {
  insertCSS
} from './helper';

export * from './helper';

insertCSS('dmn-font.css',
  require('dmn-font/dist/css/dmn-embedded.css')
);

insertCSS('diagram-js.css',
  require('diagram-js/assets/diagram-js.css')
);

insertCSS('dmn-js-shared.css',
  require('dmn-js-shared/assets/css/dmn-js-shared.css')
);

insertCSS('dmn-js-decision-table.css',
  require('../assets/css/dmn-js-decision-table.css')
);

insertCSS('dmn-js-decision-table-controls.css',
  require('../assets/css/dmn-js-decision-table-controls.css')
);

insertCSS('dmn-js-testing.css',
  '.test-container .dmn-js-parent { height: 576px; }' +
  '.dmn-decision-table-container { min-height: 400px; overflow: scroll }' +
  '.tjs-container { display: table }'
);