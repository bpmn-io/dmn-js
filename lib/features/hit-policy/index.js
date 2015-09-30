module.exports = {
  __init__: [ 'hitPolicy', 'hitPolicyRenderer' ],
  __depends__: [],
  hitPolicy: [ 'type', require('./HitPolicy') ],
  hitPolicyRenderer: [ 'type', require('./HitPolicyRenderer') ],
};
