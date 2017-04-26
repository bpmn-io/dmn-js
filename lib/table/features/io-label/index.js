module.exports = {
  __init__: [ 'ioLabel', 'ioLabelRules', 'ioLabelRenderer' ],
  __depends__: [
    require('diagram-js/lib/i18n/translate')
  ],
  ioLabel: [ 'type', require('./IoLabel') ],
  ioLabelRules: [ 'type', require('./IoLabelRules') ],
  ioLabelRenderer: [ 'type', require('./IoLabelRenderer') ]
};
