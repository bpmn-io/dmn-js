import { ContextEditor } from './ContextEditor';
import { ContextEditorComponentProvider } from './components/ContextEditorComponent';

import ModelingModule from '../modeling';

export default {
  __init__: [ 'contextComponent' ],
  __depends__: [
    ModelingModule
  ],
  context: [ 'type', ContextEditor ],
  contextComponent: [ 'type', ContextEditorComponentProvider ]
};
