import ContextMenu from 'table-js/lib/features/context-menu';
import CellSelection from '../cell-selection';

import SimpleMode from './SimpleMode';

export default {
  __depends__: [
    ContextMenu,
    CellSelection
  ],
  __init__: [ 'simpleMode' ],
  simpleMode: [ 'type', SimpleMode ]
};