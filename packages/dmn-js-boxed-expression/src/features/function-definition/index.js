import { FunctionDefinition } from './FunctionDefinition';
import {
  FunctionDefinitionComponentProvider
} from './components/FunctionDefinitionComponent';

export default {
  __init__: [ 'functionDefinitionComponent' ],
  functionDefinition: [ 'type', FunctionDefinition ],
  functionDefinitionComponent: [ 'type', FunctionDefinitionComponentProvider ]
};