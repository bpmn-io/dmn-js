module.exports = {
  __init__: [ 'annotations', 'annotationsRenderer'],
  __depends__: [
    require('diagram-js/lib/i18n/translate')
  ],
  annotations: [ 'type', require('./Annotations') ],
  annotationsRenderer: [ 'type', require('./AnnotationsRenderer') ]
};
