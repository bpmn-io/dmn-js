import InputNumberEdit from './components/InputNumberEdit';
import OutputNumberEdit from './components/OutputNumberEdit';

import { isInput, isOutput } from 'dmn-js-shared/lib/util/ModelUtil';

export default class SimpleNumberEdit {
  constructor(components, simpleMode) {
    simpleMode.registerProvider(element => {
      const typeRef = getTypeRef(element);

      return (isInput(element.col) || isOutput(element.col))
        && (typeRef === 'integer' || typeRef === 'long' || typeRef === 'double');
    });

    components.onGetComponent('context-menu', (context = {}) => {
      if (context.contextMenuType && context.contextMenuType === 'simple-mode-edit') {

        if (!context.element) {
          return;
        }

        const typeRef = getTypeRef(context.element);

        if (isNumber(typeRef)) {

          if (isInput(context.element.col)) {
            return InputNumberEdit;
          } else if (isOutput(context.element.col)) {
            return OutputNumberEdit;
          }

        }

      }
    });
  }
}

SimpleNumberEdit.$inject = [ 'components', 'simpleMode' ];


// helpers //////////////////////

function getTypeRef(element) {
  if (isInput(element.col)) {
    return element.col && element.col.businessObject.inputExpression.typeRef;
  } else {
    return element.col && element.col.businessObject.typeRef;
  }
}

function isNumber(typeRef) {
  return typeRef === 'integer' || typeRef === 'long' || typeRef === 'double';
}