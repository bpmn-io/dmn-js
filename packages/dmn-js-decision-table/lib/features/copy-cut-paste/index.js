import Clipboard from 'diagram-js/lib/features/clipboard';
import CopyCutPaste from './CopyCutPaste';

export default {
  __depends__: [ Clipboard ],
  __init__: [ 'copyCutPaste' ],
  copyCutPaste: [ 'type', CopyCutPaste ]
};