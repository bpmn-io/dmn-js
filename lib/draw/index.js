'use strict';

module.exports = {
  __init__: [ 'drdRenderer', 'decisionLabelUpdater' ],
  drdRenderer: [ 'type', require('./DrdRenderer') ],
  pathMap: [ 'type', require('./PathMap')],
  decisionLabelUpdater: [ 'type', require('./DecisionLabelUpdater') ]
};
