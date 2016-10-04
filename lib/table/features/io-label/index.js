module.exports = {
  __init__: [ 'ioLabel', 'ioLabelRules', 'ioLabelRenderer' ],
  __depends__: [],
  ioLabel: [ 'type', require('./IoLabel') ],
  ioLabelRules: [ 'type', require('./IoLabelRules') ],
  ioLabelRenderer: [ 'type', require('./IoLabelRenderer') ]
};
