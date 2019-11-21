import ContextMenu from 'table-js/lib/features/context-menu';
import TypeRefEditingProvider from './TypeRefEditingProvider';
import Translate from 'diagram-js/lib/i18n/translate';

export default {
  __depends__: [ ContextMenu, Translate ],
  __init__: [ 'typeRefEditingProvider' ],
  typeRefEditingProvider: [ 'type', TypeRefEditingProvider ]
};