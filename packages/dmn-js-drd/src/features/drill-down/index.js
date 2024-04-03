import TranslateModule from 'diagram-js/lib/i18n/translate';
import OverlaysModule from 'diagram-js/lib/features/overlays';

import DrillDown from './DrillDown';

export default {
  __depends__: [
    OverlaysModule,
    TranslateModule
  ],
  __init__: [ 'drillDown' ],
  drillDown: [ 'type', DrillDown ]
};
