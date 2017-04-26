module.exports = {
  __init__: [ 'simpleMode' ],
  __depends__: [
    require('diagram-js/lib/i18n/translate')
  ],
  simpleMode: [ 'type', require('./SimpleMode') ]
};
