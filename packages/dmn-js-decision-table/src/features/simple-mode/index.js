import ContextMenu from 'table-js/lib/features/context-menu';
import CellSelection from '../cell-selection';
import ExpressionLanguagesModule from 'dmn-js-shared/lib/features/expression-languages';

import SimpleMode from './SimpleMode';

export default {
  __depends__: [
    ContextMenu,
    CellSelection,
    ExpressionLanguagesModule
  ],
  __init__: [ 'simpleMode' ],
  simpleMode: [ 'type', SimpleMode ]
};