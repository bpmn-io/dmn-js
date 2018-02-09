const TestHelper = module.exports = require('./helper');

TestHelper.insertCSS('dmn-js-literal-expression-js.css',
  require('../assets/css/dmn-js-literal-expression.css')
);

TestHelper.insertCSS('dmn-js-testing.css',
  '.test-container .dmn-js-parent { height: 500px; }'
);