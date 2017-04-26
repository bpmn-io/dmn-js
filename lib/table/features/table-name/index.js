module.exports = {
  __init__: [ 'tableName' ],
  __depends__: [
    require('diagram-js/lib/i18n/translate')
  ],
  tableName: [ 'type', require('./TableName') ]
};
