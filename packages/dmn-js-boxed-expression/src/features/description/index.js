import InteractionModule from 'table-js/lib/features/interaction-events';
import ContextMenuModule from 'table-js/lib/features/context-menu';

import Description from './Description';


export default {
  __depends__: [
    ContextMenuModule,
    InteractionModule
  ],
  __init__: [
    'description'
  ],
  description: [ 'type', Description ]
};