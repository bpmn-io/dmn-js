import ClipboardModule from 'diagram-js/lib/features/clipboard';
import RulesModule from '../rules';
import Translate from 'diagram-js/lib/i18n/translate';

import CopyCutPaste from './CopyCutPaste';

export default {
  __depends__: [
    ClipboardModule,
    RulesModule,
    Translate
  ],
  __init__: [
    'copyCutPaste'
  ],
  copyCutPaste: [ 'type', CopyCutPaste ]
};