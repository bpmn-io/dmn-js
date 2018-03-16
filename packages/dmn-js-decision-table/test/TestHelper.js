const TestHelper = module.exports = require('./helper');

TestHelper.insertCSS('dmn-font.css',
  require('dmn-font/dist/css/dmn-embedded.css')
);

TestHelper.insertCSS('dmn-js-decision-table.css',
  require('../assets/css/dmn-js-decision-table.css')
);

TestHelper.insertCSS('dmn-js-decision-table-controls.css',
  require('../assets/css/dmn-js-decision-table-controls.css')
);

TestHelper.insertCSS('diagram-js.css',
  require('diagram-js/assets/diagram-js.css')
);

TestHelper.insertCSS('dmn-js-testing.css',
  '.test-container .dmn-js-parent { height: 576px; }' +
  '.dmn-decision-table-container { min-height: 400px; overflow: scroll }' +
  '.tjs-container { display: table }'
);