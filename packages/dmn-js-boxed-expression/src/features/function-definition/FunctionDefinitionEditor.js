import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import {
  FunctionDefinitionEditorComponent
} from './components/FunctionDefinitionEditorComponent';

export class FunctionDefinitionEditor {
  $inject = [ 'components' ];

  constructor(components) {
    components.onGetComponent('expression', ({ expression }) => {
      if (is(expression, 'dmn:FunctionDefinition')) {
        return FunctionDefinitionEditorComponent;
      }
    });
  }
}