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

insertCSS('dmn-js-boxed-expression.css',
  require('../assets/css/dmn-js-boxed-expression.css')
);

insertCSS('dmn-js-boxed-expression-controls.css',
  require('../assets/css/dmn-js-boxed-expression-controls.css')
);

insertCSS('dmn-js-testing.css',
  `.test-container {
    display: flex;
    flex-direction: column;
  }
  .test-container .test-content-container {
    flex-grow: 1;
    overflow: hidden;
    width: auto;
    height: auto;
    padding: 10px;
  }
  .test-container .dmn-js-parent {
    height: 500px;
    width: 800px
  }`
);