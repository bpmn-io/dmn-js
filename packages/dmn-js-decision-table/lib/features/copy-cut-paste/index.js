import Clipboard from 'diagram-js/lib/features/clipboard';
import CopyCutPaste from './CopyCutPaste';
import Selection from 'table-js/lib/features/selection';

export default {
  __depends__: [ Clipboard, Selection ],
  __init__: [ 'copyCutPaste' ],
  copyCutPaste: [ 'type', CopyCutPaste ]
};