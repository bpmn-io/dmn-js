import SearchPadModule from 'diagram-js/lib/features/search-pad';

import DmnSearchProvider from './DmnSearchProvider';


export default {
  __depends__: [
    SearchPadModule
  ],
  __init__: [ 'dmnSearch' ],
  dmnSearch: [ 'type', DmnSearchProvider ]
};
