import SelectionModule from 'table-js/lib/features/selection';
import InteractionEventsModule from 'table-js/lib/features/interaction-events';

import CellSelection from './CellSelection';
import Translate from 'diagram-js/lib/i18n/translate';


export default {
  __depends__: [
    InteractionEventsModule,
    SelectionModule,
    Translate
  ],
  __init__: [
    'cellSelection'
  ],
  cellSelection: [ 'type', CellSelection ]
};