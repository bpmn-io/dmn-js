import { BoxedContext } from './BoxedContext';
import {
  FunctionDefinitionComponentProvider
} from './components/FunctionDefinitionComponent';

export default {
  __init__: [ 'functionDefinitionComponent' ],
  functionDefinition: [ 'type', BoxedContext ],
  functionDefinitionComponent: [ 'type', FunctionDefinitionComponentProvider ]
};