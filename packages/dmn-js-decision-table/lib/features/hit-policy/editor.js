import ContextMenu from 'table-js/lib/features/context-menu';
import HitPolicyEditor from './HitPolicyEditor';

export default {
  __depends__: [ ContextMenu ],
  __init__: [ 'hitPolicy' ],
  hitPolicy: [ 'type', HitPolicyEditor ]
};