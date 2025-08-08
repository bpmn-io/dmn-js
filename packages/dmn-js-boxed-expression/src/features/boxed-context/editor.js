import ContextMenuModule from 'table-js/lib/features/context-menu';

import { BoxedContextEditor } from './BoxedContextEditor';
import {
  BoxedContextComponentProvider
} from './components/BoxedContextEditorComponent';

export default {
  __init__: [
    'boxedContextComponent'
  ],
  __depends__: [ ContextMenuModule ],
  boxedContext: [ 'type', BoxedContextEditor ],
  boxedContextComponent: [ 'type', BoxedContextComponentProvider ]
};