import { getBoxedExpression, is } from 'dmn-js-shared/lib/util/ModelUtil';

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
    const typeHolder = this.getTypeHolder();

    return (typeHolder && typeHolder.get('typeRef')) || 'Any';
  }

  // a business knowledge model's variable is of a function type and
  // cannot carry the result type; that lives on the body of its
  // encapsulated function instead
  getTypeHolder() {
    const element = this._getElement();

    if (is(element, 'dmn:BusinessKnowledgeModel')) {
      return getBoxedExpression(element);
    }

    return this.getVariable();
  }

  _getElement() {
    return this._viewer.getRootElement();
  }

  getVariable() {
    return this._getElement().get('variable');
  }
}
