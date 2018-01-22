import ContextMenu from 'table-js/lib/features/context-menu';
import Selection from 'table-js/lib/features/selection';
import SimpleMode from './SimpleMode';

export default {
  __depends__: [ ContextMenu, Selection ],
  __init__: [ 'simpleMode' ],
  simpleMode: [ 'type', SimpleMode ]
};