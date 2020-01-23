import DistributeElementsModule from 'diagram-js/lib/features/distribute-elements';

import DrdDistributeElements from './DrdDistributeElements';


export default {
  __depends__: [
    DistributeElementsModule
  ],
  __init__: [ 'drdDistributeElements' ],
  drdDistributeElements: [ 'type', DrdDistributeElements ]
};
