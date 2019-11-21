import InteractionModule from 'table-js/lib/features/interaction-events';
import ContextMenuModule from 'table-js/lib/features/context-menu';
import Translate from 'diagram-js/lib/i18n/translate';

import Description from './Description';


export default {
  __depends__: [
    ContextMenuModule,
    InteractionModule,
    Translate
  ],
  __init__: [
    'description'
  ],
  description: [ 'type', Description ]
};