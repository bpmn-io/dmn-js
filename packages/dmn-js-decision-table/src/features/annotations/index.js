import AnnotationsProvider from './AnnotationsProvider';
import Translate from 'diagram-js/lib/i18n/translate';

export default {
  __depends__: [ Translate ],
  __init__: [ 'annotationsProvider' ],
  annotationsProvider: [ 'type', AnnotationsProvider ]
};