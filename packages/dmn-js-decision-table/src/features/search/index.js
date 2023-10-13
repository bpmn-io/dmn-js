import SearchPadModule from 'diagram-js/lib/features/search-pad';

import DmnSearchProvider from './DecisionTableSearchProvider';


export default {
  __depends__: [
    SearchPadModule
  ],
  __init__: [ 'dmnSearch' ],
  dmnSearch: [ 'type', DmnSearchProvider ]
};
