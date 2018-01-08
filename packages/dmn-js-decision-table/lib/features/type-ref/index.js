import ContextMenu from 'table-js/lib/features/context-menu';
import Modeling from '../modeling';
import TypeRef from './TypeRef';

export default {
  __depends__: [ ContextMenu, Modeling ],
  __init__: [ 'typeRef' ],
  typeRef: [ 'type', TypeRef ]
};