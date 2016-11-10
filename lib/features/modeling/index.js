'use strict';

module.exports = {
  __init__: [ 'modeling', 'drdUpdater' ],
  __depends__: [
    require('./behavior'),
    require('../rules'),
    require('../drill-down'),
    require('../definition-id/viewer'),
    require('diagram-js/lib/command'),
    require('diagram-js/lib/features/selection'),
    require('diagram-js/lib/features/change-support')
  ],
  drdFactory: [ 'type', require('./DrdFactory') ],
  drdUpdater: [ 'type', require('./DrdUpdater') ],
  elementFactory: [ 'type', require('./ElementFactory') ],
  modeling: [ 'type', require('./Modeling') ],
  layouter: [ 'type', require('./DrdLayouter') ],
  connectionDocking: [ 'type', require('diagram-js/lib/layout/CroppingConnectionDocking') ]
};
