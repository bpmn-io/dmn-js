import { ViewRenderer } from './ViewRenderer';
import { TableJsSupport } from './TableJsSupport';

export default {
  __init__: [ 'viewRenderer', 'tableJsSupport' ],
  'viewRenderer': [ 'type', ViewRenderer ],
  'tableJsSupport': [ 'type', TableJsSupport ]
};
