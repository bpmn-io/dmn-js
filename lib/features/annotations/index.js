module.exports = {
  __init__: [ 'annotations', 'annotationsRenderer'],
  __depends__: [
  ],
  annotations: [ 'type', require('./Annotations') ],
  annotationsRenderer: [ 'type', require('./AnnotationsRenderer') ]
};
