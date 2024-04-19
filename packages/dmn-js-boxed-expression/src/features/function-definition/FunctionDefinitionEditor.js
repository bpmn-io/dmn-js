import { FunctionDefinition } from './FunctionDefinition';

export class FunctionDefinitionEditor extends FunctionDefinition {
  static $inject = [ 'modeling', 'dmnFactory' ];

  constructor(modeling, dmnFactory) {
    super();

    this._modeling = modeling;
    this._dmnFactory = dmnFactory;
  }

  addParameter(functionDefinition) {
    this._modeling.updateProperties(functionDefinition, {
      formalParameter: [
        ...this.getParameters(functionDefinition),
        this._dmnFactory.create('dmn:InformationItem', {
          name: '',
          typeRef: ''
        })
      ]
    });
  }

  removeParameter(functionDefinition, parameter) {
    this._modeling.updateProperties(functionDefinition, {
      formalParameter: this.getParameters(functionDefinition).filter(p => p !== parameter)
    });
  }

  updateParameter(parameter, properties) {
    this._modeling.updateProperties(parameter, properties);
  }

  setKind(functionDefinition, kind) {
    this._modeling.updateProperties(functionDefinition, {
      kind
    });
  }
}