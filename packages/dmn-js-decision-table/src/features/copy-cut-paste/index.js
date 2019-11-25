import ClipboardModule from 'diagram-js/lib/features/clipboard';
import RulesModule from '../rules';

import CopyCutPaste from './CopyCutPaste';

export default {
  __depends__: [
    ClipboardModule,
    RulesModule,
    'translate'
  ],
  __init__: [
    'copyCutPaste'
  ],
  copyCutPaste: [ 'type', CopyCutPaste ]
};