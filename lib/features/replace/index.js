module.exports = {
  __depends__: [
    require('diagram-js/lib/i18n/translate'),
    require('diagram-js/lib/features/replace'),
    require('diagram-js/lib/features/selection')
  ],
  drdReplace: [ 'type', require('./DrdReplace') ]
};
