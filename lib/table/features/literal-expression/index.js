module.exports = {
  __init__: [ 'literalExpressionEditor' ],
  __depends__: [
    require('diagram-js/lib/i18n/translate')
  ],
  literalExpressionEditor: [ 'type', require('./LiteralExpressionEditor') ]
};
