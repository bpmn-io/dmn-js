import TranslateModule from 'diagram-js/lib/i18n/translate';
import OverlaysModule from 'diagram-js/lib/features/overlays';

import DataTypesModule from 'dmn-js-shared/lib/features/data-types';

import TypeRefDropdown from './TypeRefDropdown';

export default {
  __depends__: [
    DataTypesModule,
    OverlaysModule,
    TranslateModule
  ],
  __init__: [ 'typeRefDropdown' ],
  typeRefDropdown: [ 'type', TypeRefDropdown ]
};
