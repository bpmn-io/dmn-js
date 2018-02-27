import InputDateEdit from './components/InputDateEdit';
import OutputDateEdit from './components/OutputDateEdit';

import { isInput, isOutput } from 'dmn-js-shared/lib/util/ModelUtil';

export default class SimpleDateEdit {
  constructor(components, simpleMode) {
    simpleMode.registerProvider(element => {
      const typeRef = getTypeRef(element);

      return (isInput(element.col) || isOutput(element.col))
        && isDate(typeRef);
    });

    components.onGetComponent('context-menu', (context = {}) => {
      if (context.contextMenuType && context.contextMenuType === 'simple-mode-edit') {

        if (!context.element) {
          return;
        }

        const typeRef = getTypeRef(context.element);

        if (isDate(typeRef)) {

          if (isInput(context.element.col)) {
            return InputDateEdit;
          } else if (isOutput(context.element.col)) {
            return OutputDateEdit;
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

function isDate(typeRef) {
  return typeRef === 'date';
}