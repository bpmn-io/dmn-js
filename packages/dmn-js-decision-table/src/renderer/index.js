import BaseRenderModule from 'table-js/lib/render';

import Renderer from './Renderer';

export default {
  __depends__: [ BaseRenderModule ],
  'renderer': [ 'type', Renderer ]
};