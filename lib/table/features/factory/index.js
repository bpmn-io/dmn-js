module.exports = {
  __depends__: [
    require('diagram-js/lib/i18n/translate')
  ],
  tableFactory: [ 'type', require('./TableFactory') ],
  elementFactory: [ 'type', require('./ElementFactory') ]
};
