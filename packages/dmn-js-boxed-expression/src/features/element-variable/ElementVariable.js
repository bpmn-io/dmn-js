export default class ElementVariable {
  static $inject = [ 'viewer' ];

  constructor(viewer) {
    this._viewer = viewer;
  }

  getName() {
    const variable = this.getVariable(),
          element = this._getElement();

    const variableName = variable ? variable.get('name') : null;

    return variableName || element.get('name');
  }

  getType() {
    const variable = this.getVariable();

    return variable ? variable.get('typeRef') : 'Any';
  }

  _getElement() {
    return this._viewer.getRootElement();
  }

  getVariable() {
    return this._getElement().get('variable');
  }
}
