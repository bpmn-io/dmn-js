module.exports = {
  __init__: [ 'modeling' ],
  __depends__: [
    require('table-js/lib/features/modeling')
  ],
  modeling: [ 'type', require('./Modeling') ],
};
