'use strict';

module.exports = {
  __depends__: [
    require('diagram-js/lib/features/rules')
  ],
  __init__: [ 'drdRules' ],
  drdRules: [ 'type', require('./DrdRules') ]
};
