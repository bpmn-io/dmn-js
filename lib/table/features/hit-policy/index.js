module.exports = {
  __init__: [ 'hitPolicy', 'hitPolicyRenderer' ],
  __depends__: [
    require('diagram-js/lib/i18n/translate'),
    require('table-js/lib/features/utility-column'),
    require('../io-label')
  ],
  hitPolicy: [ 'type', require('./HitPolicy') ],
  hitPolicyRenderer: [ 'type', require('./HitPolicyRenderer') ]
};
