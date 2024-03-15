import { FunctionDefinitionEditor } from './FunctionDefinitionEditor';
import {
  FunctionDefinitionComponentProvider
} from './components/FunctionDefinitionEditorComponent';

export default {
  __init__: [ 'functionDefinitionComponent' ],
  functionDefinition: [ 'type', FunctionDefinitionEditor ],
  functionDefinitionComponent: [ 'type', FunctionDefinitionComponentProvider ]
};