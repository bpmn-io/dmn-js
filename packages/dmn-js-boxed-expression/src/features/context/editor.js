import { ContextEditor } from './ContextEditor';
import { ContextComponentProvider } from './components/ContextComponent';

import ModelingModule from '../modeling';

export default {
  __init__: [ 'contextComponent' ],
  __depends__: [
    ModelingModule
  ],
  context: [ 'type', ContextEditor ],
  contextComponent: [ 'type', ContextComponentProvider ]
};
