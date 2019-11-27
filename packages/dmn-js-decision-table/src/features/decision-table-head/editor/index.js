import ContextMenu from 'table-js/lib/features/context-menu';
import DebounceInput from 'dmn-js-shared/lib/features/debounce-input';
import ExpressionLanguagesModule from 'dmn-js-shared/lib/features/expression-languages';

import OutputEditingProvider from './OutputEditingProvider';
import InputEditingProvider from './InputEditingProvider';

import TypeRefEditing from '../../type-ref';
import AllowedValuesEditing from '../../allowed-values';
import AddInputOutput from '../../add-input-output';


export default {
  __depends__: [
    AddInputOutput,
    AllowedValuesEditing,
    ContextMenu,
    DebounceInput,
    ExpressionLanguagesModule,
    TypeRefEditing
  ],
  __init__: [
    'inputEditingProvider',
    'outputEditingProvider'
  ],
  inputEditingProvider: [ 'type', InputEditingProvider ],
  outputEditingProvider: [ 'type', OutputEditingProvider ]
};