import ClipboardModule from 'diagram-js/lib/features/clipboard';
import RulesModule from '../rules';

import CopyCutPaste from './CopyCutPaste';

export default {
  __depends__: [
    ClipboardModule,
    RulesModule
  ],
  __init__: [
    'copyCutPaste'
  ],
  copyCutPaste: [ 'type', CopyCutPaste ]
};