'use strict';

module.exports = {
  __depends__: [
    require('diagram-js/lib/features/context-pad')
  ],
  __init__: [ 'drillDown' ],
  drillDown: [ 'type', require('./DrillDown') ]
};
