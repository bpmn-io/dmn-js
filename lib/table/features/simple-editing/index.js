module.exports = {
  __init__: [ 'simpleEditing' ],
  __depends__: [
    require('diagram-js/lib/i18n/translate')
  ],
  simpleEditing: [ 'type', require('./SimpleEditing') ]
};
