import AutoPlaceModule from 'diagram-js/lib/features/auto-place';

import DmnAutoPlace from './DmnAutoPlace';

export default {
  __depends__: [ AutoPlaceModule ],
  __init__: [ 'dmnAutoPlace' ],
  dmnAutoPlace: [ 'type', DmnAutoPlace ]
};