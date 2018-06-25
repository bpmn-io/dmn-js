import ContextMenu from 'table-js/lib/features/context-menu';
import TypeRefEditingProvider from './TypeRefEditingProvider';

export default {
  __depends__: [ ContextMenu ],
  __init__: [ 'typeRefEditingProvider' ],
  typeRefEditingProvider: [ 'type', TypeRefEditingProvider ]
};