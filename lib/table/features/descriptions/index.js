module.exports = {
  __init__: [ 'descriptions' ],
  __depends__: [
    require('diagram-js/lib/i18n/translate')
  ],
  descriptions: [ 'type', require('./Descriptions') ]
};
