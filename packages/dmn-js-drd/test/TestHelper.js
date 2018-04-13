import {
  insertCSS
} from './helper';

export * from './helper';

insertCSS('dmn-font.css',
  require('dmn-font/dist/css/dmn-embedded.css')
);

insertCSS('dmn-js-drd.css', require('../assets/css/dmn-js-drd.css'));

insertCSS('diagram-js.css', require('diagram-js/assets/diagram-js.css'));

insertCSS('dmn-js-testing.css',
  '.test-container .dmn-js-parent { height: 500px; }'
);