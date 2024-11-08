import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import {
  getBusinessObject,
  is
} from 'dmn-js-shared/lib/util/ModelUtil';


export default class NameChangeBehavior extends CommandInterceptor {

  static $inject = [ 'eventBus', 'modeling' ];

  constructor(eventBus, modeling) {
    super(eventBus);

    this._modeling = modeling;

    this.postExecuted('element.updateProperties', this.updateVariableFromElement);
    this.postExecuted('element.updateLabel', this.updateVariableFromLabel);
  }

  updateVariableFromLabel = ({ context }) => {
    const { element, newLabel } = context;
    const bo = getBusinessObject(element),
          variable = bo.variable;

    if (!variable) {
      return;
    }

    this._modeling.updateProperties(variable, { name: newLabel });
  };

  updateVariableFromElement = ({ context }) => {
    const { element, properties } = context;
    const bo = getBusinessObject(element);

    if (!bo.variable) {
      return;
    }

    if (!(is(element, 'dmn:Decision') || is(element, 'dmn:BusinessKnowledgeModel'))) {
      return;
    }

    if (!this.isNameChanged(properties)) {
      return;
    }

    if (this.isVariable(element)) {
      return;
    }

    else if (!this.shouldSyncVariable(element)) {
      this.syncElementVariableChange(bo);
    }
  };

  isNameChanged(properties) {
    return 'name' in properties;
  }

  isVariable(element) {
    const parent = getParent(element);
    return (
      is(element, 'dmn:InformationItem') &&
      parent && parent.get('variable') === element
    );
  }

  shouldSyncVariable(element) {
    const bo = getBusinessObject(element),
          variable = bo.get('variable');
    return variable && (bo.name === variable.name);
  }

  syncElementVariableChange(businessObject) {
    const name = businessObject.get('name');
    const variable = businessObject.variable;
    this._modeling.updateProperties(variable, { name });
  }
}

// helpers //////////////////////

function getParent(element) {
  return element.$parent;
}