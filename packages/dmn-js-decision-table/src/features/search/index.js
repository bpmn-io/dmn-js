import SelectionModule from 'table-js/lib/features/selection';

import DmnSearchProvider from './DecisionTableSearchProvider';
import SearchPad from './SearchPad';


export default {
  __depends__: [
    SelectionModule
  ],
  __init__: [ 'dmnSearch' ],
  dmnSearch: [ 'type', DmnSearchProvider ],
  searchPad: [ 'type', SearchPad ]
};
