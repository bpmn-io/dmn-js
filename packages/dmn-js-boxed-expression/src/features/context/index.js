import { Context } from './Context';
import { ContextComponentProvider } from './components/ContextComponent';

export default {
  __init__: [ 'contextComponent' ],
  context: [ 'type', Context ],
  contextComponent: [ 'type', ContextComponentProvider ]
};
