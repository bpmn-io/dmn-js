import TableImporter from './TableImporter';
import Translate from 'diagram-js/lib/i18n/translate';

export default {
  __depends__: [ Translate ],
  tableImporter: [ 'type', TableImporter ]
};