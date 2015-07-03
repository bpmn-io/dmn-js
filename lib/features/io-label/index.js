module.exports = {
  __init__: [ 'ioLabel', 'ioLabelRules' ],
  __depends__: [],
  ioLabel: [ 'type', require('./IoLabel') ],
  ioLabelRules: [ 'type', require('./IoLabelRules')]
};
