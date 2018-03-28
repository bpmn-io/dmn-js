import DiagramTranslate from 'diagram-js/lib/i18n/translate';
import DiagramPopupMenu from 'diagram-js/lib/features/popup-menu';
import Replace from '../replace';

import ReplaceMenuProvider from './ReplaceMenuProvider';

export default {
  __depends__: [
    DiagramTranslate,
    DiagramPopupMenu,
    Replace
  ],
  __init__: [ 'replaceMenuProvider' ],
  replaceMenuProvider: [ 'type', ReplaceMenuProvider ]
};
