import InputDurationEdit from './components/InputDurationEdit';
import OutputDurationEdit from './components/OutputDurationEdit';

import { isInput, isOutput } from 'dmn-js-shared/lib/util/ModelUtil';

export default class SimpleDurationEdit {
  constructor(components, simpleMode) {
    simpleMode.registerProvider(element => {
      const typeRef = getTypeRef(element);

      return (isInput(element.col) || isOutput(element.col))
        && isDuration(typeRef);
    });

    components.onGetComponent('context-menu', (context = {}) => {
      if (context.contextMenuType && context.contextMenuType === 'simple-mode-edit') {

        if (!context.element) {
          return;
        }

        const typeRef = getTypeRef(context.element);

        if (isDuration(typeRef)) {

          if (isInput(context.element.col)) {
            return InputDurationEdit;
          } else if (isOutput(context.element.col)) {
            return OutputDurationEdit;
          }

        }

      }
    });
  }
}

SimpleDurationEdit.$inject = [ 'components', 'simpleMode' ];


// helpers //////////////////////

function getTypeRef(element) {
  if (isInput(element.col)) {
    return element.col && element.col.businessObject.inputExpression.typeRef;
  } else {
    return element.col && element.col.businessObject.typeRef;
  }
}

const durations = [
  'yearMonthDuration',
  'dayTimeDuration'
];

function isDuration(typeRef) {
  return durations.includes(typeRef);
}
