import AnnotationsProvider from './AnnotationsProvider';

export default {
  __depends__: [ 'translate' ],
  __init__: [ 'annotationsProvider' ],
  annotationsProvider: [ 'type', AnnotationsProvider ]
};