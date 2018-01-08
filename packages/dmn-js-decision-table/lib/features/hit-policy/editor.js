import ContextMenu from 'table-js/lib/features/context-menu';
import HitPolicyEditor from './HitPolicyEditor';
import Modeling from '../modeling';

export default {
  __depends__: [ ContextMenu, Modeling ],
  __init__: [ 'hitPolicy' ],
  hitPolicy: [ 'type', HitPolicyEditor ]
};