import ContextMenuModule from 'table-js/lib/features/context-menu';

import { FunctionDefinitionEditor } from './FunctionDefinitionEditor';
import {
  FunctionDefinitionComponentProvider
} from './components/FunctionDefinitionEditorComponent';
import { KindEditorProvider } from './components/KindEditor';
import { FormalParametersEditorProvider } from './components/FormalParametersEditor';

export default {
  __init__: [
    'formalParametersEditorComponent',
    'functionDefinitionComponent',
    'kindEditorComponent'
  ],
  __depends__: [ ContextMenuModule ],
  formalParametersEditorComponent: [ 'type', FormalParametersEditorProvider ],
  functionDefinition: [ 'type', FunctionDefinitionEditor ],
  functionDefinitionComponent: [ 'type', FunctionDefinitionComponentProvider ],
  kindEditorComponent: [ 'type', KindEditorProvider ]
};