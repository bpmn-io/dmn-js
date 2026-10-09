import InputTimeEdit from './components/InputTimeEdit';
import OutputTimeEdit from './components/OutputTimeEdit';

import { isInput, isOutput } from 'dmn-js-shared/lib/util/ModelUtil';

export default class SimpleDateEdit {
  constructor(components, simpleMode) {
    simpleMode.registerProvider(element => {
      const typeRef = getTypeRef(element);

      return (isInput(element.col) || isOutput(element.col))
        && isTime(typeRef);
    });

    components.onGetComponent('context-menu', (context = {}) => {
      if (context.contextMenuType && context.contextMenuType === 'simple-mode-edit') {

        if (!context.element) {
          return;
        }

        const typeRef = getTypeRef(context.element);

        if (isTime(typeRef)) {

          if (isInput(context.element.col)) {
            return InputTimeEdit;
          } else if (isOutput(context.element.col)) {
            return OutputTimeEdit;
          }

        }

      }
    });
  }
}

SimpleDateEdit.$inject = [ 'components', 'simpleMode' ];


// helpers //////////////////////

function getTypeRef(element) {
  if (isInput(element.col)) {
    return element.col && element.col.businessObject.inputExpression.typeRef;
  } else {
    return element.col && element.col.businessObject.typeRef;
  }
}

function isTime(typeRef) {
  return typeRef === 'time';
}
