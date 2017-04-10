'use strict';

module.exports = {
  __init__: [ 'numberEdit' ],
  __depends__: [
    require('../../../features/templates')
  ],
  numberEdit: [ 'type', require('./NumberEdit') ]
};
