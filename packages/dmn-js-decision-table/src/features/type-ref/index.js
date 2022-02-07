import DataTypesModule from 'dmn-js-shared/lib/features/data-types';
import ContextMenu from 'table-js/lib/features/context-menu';
import TypeRefEditingProvider from './TypeRefEditingProvider';

export default {
  __depends__: [
    ContextMenu,
    DataTypesModule
  ],
  __init__: [ 'typeRefEditingProvider' ],
  typeRefEditingProvider: [ 'type', TypeRefEditingProvider ]
};