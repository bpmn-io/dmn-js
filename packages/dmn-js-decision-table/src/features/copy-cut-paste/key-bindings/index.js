import ClipboardModule from 'diagram-js/lib/features/clipboard';
import CellSelectionModule from '../../cell-selection';

import CopyCutPasteKeyBindings from './CopyCutPasteKeyBindings';


export default {
  __depends__: [
    ClipboardModule,
    CellSelectionModule
  ],
  __init__: [
    'copyCutPasteKeyBindings'
  ],
  copyCutPasteKeyBindings: [ 'type', CopyCutPasteKeyBindings ]
};