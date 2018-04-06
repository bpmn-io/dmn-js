import SelectionModule from 'table-js/lib/features/selection';

import CellSelection from './CellSelection';


export default {
  __depends__: [
    SelectionModule
  ],
  __init__: [
    'cellSelection'
  ],
  cellSelection: [ 'type', CellSelection ]
};