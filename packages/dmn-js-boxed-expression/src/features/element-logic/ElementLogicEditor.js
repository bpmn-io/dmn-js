import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import { ElementLogic } from './ElementLogic';

export class ElementLogicEditor extends ElementLogic {
  static $inject = [ 'viewer', 'modeling' ];

  constructor(viewer, modeling) {
    super(viewer);

    this._viewer = viewer;
    this._modeling = modeling;
  }

  setLogic(parent, newExpression) {
    const properties = {};

    if (is(parent, 'dmn:Decision')) {
      properties.decisionLogic = newExpression;
    } else if (is(parent, 'dmn:BusinessKnowledgeModel')) {
      properties.encapsulatedLogic = newExpression;
    } else if (is(parent, 'dmn:FunctionDefinition')) {
      properties.body = newExpression;
    } else if (is(parent, 'dmn:ContextEntry')) {
      properties.value = newExpression;
    }

    this._modeling.updateProperties(parent, properties);
  }
}
