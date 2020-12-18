import DiagramTranslate from 'diagram-js/lib/i18n/translate';
import DiagramPalette from 'diagram-js/lib/features/palette';
import DiagramCreate from 'diagram-js/lib/features/create';
import DiagramLasso from 'diagram-js/lib/features/lasso-tool';
import DiagramHand from 'diagram-js/lib/features/hand-tool';

import PaletteProvider from './PaletteProvider';

export default {
  __depends__: [
    DiagramTranslate,
    DiagramPalette,
    DiagramCreate,
    DiagramLasso,
    DiagramHand
  ],
  __init__: [ 'paletteProvider' ],
  paletteProvider: [ 'type', PaletteProvider ]
};
