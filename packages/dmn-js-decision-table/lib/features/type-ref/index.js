import ContextMenu from 'table-js/lib/features/context-menu';
import TypeRef from './TypeRef';

export default {
  __depends__: [ ContextMenu ],
  __init__: [ 'typeRef' ],
  typeRef: [ 'type', TypeRef ]
};