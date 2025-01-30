import { BoxedContext } from './BoxedContext';
import {
  BoxedContextComponentProvider
} from './components/BoxedContextComponent';

export default {
  __init__: [ 'boxedContextComponent' ],
  boxedContext: [ 'type', BoxedContext ],
  boxedContextComponent: [ 'type', BoxedContextComponentProvider ]
};