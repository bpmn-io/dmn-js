import DiagramTranslate from 'diagram-js/lib/i18n/translate';
import DiagramContextPad from 'diagram-js/lib/features/context-pad';
import DiagramSelection from 'diagram-js/lib/features/selection';
import DiagramConnect from 'diagram-js/lib/features/connect';
import DiagramCreate from 'diagram-js/lib/features/create';
import PopupMenu from '../popup-menu';

import ContextPadProvider from './ContextPadProvider';

export default {
  __depends__: [
    DiagramTranslate,
    DiagramContextPad,
    DiagramSelection,
    DiagramConnect,
    DiagramCreate,
    PopupMenu
  ],
  __init__: [ 'contextPadProvider' ],
  contextPadProvider: [ 'type', ContextPadProvider ]
};
