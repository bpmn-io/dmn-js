'use strict';

module.exports = {
  __init__: [ 'numberEdit' ],
  __depends__: [
    require('diagram-js/lib/i18n/translate')
  ],
  numberEdit: [ 'type', require('./NumberEdit') ]
};
