import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import {
  FunctionDefinitionEditorComponent
} from './components/FunctionDefinitionEditorComponent';

export class FunctionDefinitionEditor {
  $inject = [ 'components', 'modeling', 'dmnFactory' ];

  constructor(components, modeling, dmnFactory) {
    this._modeling = modeling;
    this._dmnFactory = dmnFactory;

    components.onGetComponent('expression', ({ expression }) => {
      if (is(expression, 'dmn:FunctionDefinition')) {
        return FunctionDefinitionEditorComponent;
      }
    });
  }

  getParameters(element) {
    return element.get('formalParameter');
  }

  getBody(element) {
    return element.get('body');
  }

  addParameter(element) {
    this._modeling.updateProperties(element, {
      formalParameter: [
        ...this.getParameters(element),
        this._dmnFactory.create('dmn:InformationItem', {
          name: '',
          typeRef: ''
        })
      ]
    });
  }

  removeParameter(element, parameter) {
    this._modeling.updateProperties(element, {
      formalParameter: this.getParameters(element).filter(p => p !== parameter)
    });
  }

  updateParameter(parameter, properties) {
    this._modeling.updateProperties(parameter, properties);
  }
}