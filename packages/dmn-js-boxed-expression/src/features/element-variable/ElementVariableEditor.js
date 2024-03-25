import ElementVariable from './ElementVariable';

export default class ElementVariableEditor extends ElementVariable {
  static $inject = [ 'viewer', 'modeling', 'dmnFactory' ];

  constructor(viewer, modeling, dmnFactory) {
    super(viewer);

    this._modeling = modeling;
    this._dmnFactory = dmnFactory;
  }

  setType(typeRef) {
    const variable = this.getVariable();

    if (!variable) {
      const element = this._getElement();

      this._modeling.updateProperties(element, {
        variable: this._dmnFactory.create('dmn:InformationItem', {
          name: element.get('name'), typeRef
        })
      });

      return;
    }

    this._modeling.updateProperties(variable, { typeRef });
  }
}
