import ContextMenu from 'table-js/lib/features/context-menu';
import HitPolicyEditingProvider from './HitPolicyEditingProvider';

export default {
  __depends__: [ ContextMenu ],
  __init__: [ 'hitPolicyProvider' ],
  hitPolicyProvider: [ 'type', HitPolicyEditingProvider ]
};