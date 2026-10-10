import SelectionModule from 'table-js/lib/features/selection';
import InteractionEventsModule from 'table-js/lib/features/interaction-events';

import CellSelection from './CellSelection';


export default {
  __depends__: [
    InteractionEventsModule,
    SelectionModule
  ],
  __init__: [
    'cellSelection'
  ],
  cellSelection: [ 'type', CellSelection ]
};