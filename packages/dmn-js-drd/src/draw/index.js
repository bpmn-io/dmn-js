import DrdRenderer from './DrdRenderer';
import TextRenderer from './TextRenderer';

import PathMap from './PathMap';

export default {
  __init__: [ 'drdRenderer' ],
  drdRenderer: [ 'type', DrdRenderer ],
  textRenderer: [ 'type', TextRenderer ],
  pathMap: [ 'type', PathMap ]
};
