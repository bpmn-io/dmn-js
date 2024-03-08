import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import {
  FunctionDefinitionComponent
} from './components/FunctionDefinitionComponent';

export class FunctionDefinition {
  $inject = [ 'components' ];

  constructor(components) {
    components.onGetComponent('expression', ({ expression }) => {
      if (is(expression, 'dmn:FunctionDefinition')) {
        return FunctionDefinitionComponent;
      }
    });
  }

  getParameters(element) {
    return element.get('formalParameter');
  }
}