import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import {
  is
} from 'dmn-js-shared/lib/util/ModelUtil';


export default class NameChangeBehavior extends CommandInterceptor {

  static $inject = [ 'eventBus', 'modeling' ];

  constructor(eventBus, modeling) {
    super(eventBus);

    this._modeling = modeling;

    this.postExecuted('element.updateProperties', this.updateName);
  }

  updateName = ({ context }) => {
    const { element, properties } = context;

    if (!this.isNameChanged(properties)) {
      return;
    }

    if (this.isVariable(element)) {
      this.handleVariableNameChange(element);
    } else if (this.isVariableContainer(element)) {
      this.handleVariableContainerNameChange(element);
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

  isVariableContainer(element) {
    const variable = element.get('variable');

    return variable && is(variable, 'dmn:InformationItem');
  }

  handleVariableNameChange(variable) {
    const parent = getParent(variable),
          newName = variable.get('name');

    if (newName === parent.get('name')) {
      return;
    }

    this._modeling.updateProperties(parent, { name: newName });
  }

  handleVariableContainerNameChange(container) {
    const variable = container.get('variable'),
          newName = container.get('name');

    if (variable && newName !== variable.get('name')) {
      this._modeling.updateProperties(variable, { name: newName });
    }
  }
}


// helpers //////////////////////

function getParent(element) {
  return element.$parent;
}
