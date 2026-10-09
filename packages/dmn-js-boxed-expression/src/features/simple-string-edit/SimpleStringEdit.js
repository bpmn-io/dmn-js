import ContextMenuComponent from './components/SimpleStringEditContextMenuComponent';

import { isInput, isOutput } from 'dmn-js-shared/lib/util/ModelUtil';

export default class SimpleStringEdit {
  constructor(components, simpleMode) {
    simpleMode.registerProvider(element => {
      return (isInput(element.col) || isOutput(element.col))
        && getTypeRef(element) === 'string';
    });

    components.onGetComponent('context-menu', (context = {}) => {
      if (context.contextMenuType && context.contextMenuType === 'simple-mode-edit') {

        if (!context.element) {
          return;
        }

        const typeRef = getTypeRef(context.element);

        if (typeRef === 'string') {
          return ContextMenuComponent;
        }
      }
    });
  }
}

SimpleStringEdit.$inject = [ 'components', 'simpleMode' ];


// helpers //////////////////////

function getTypeRef(element) {
  if (isInput(element.col)) {
    return element.col && element.col.businessObject.inputExpression.typeRef;
  } else {
    return element.col && element.col.businessObject.typeRef;
  }
}