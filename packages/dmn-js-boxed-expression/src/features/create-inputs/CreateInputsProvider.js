import CreateInputsHeaderCell from './components/CreateInputHeaderCell';
import CreateInputsCell from './components/CreateInputCell';

const LOW_PRIORITY = 500;

export default class CreateInputsProvider {
  constructor(components, sheet) {
    components.onGetComponent('cell', LOW_PRIORITY, ({ cellType }) => {
      const { businessObject } = sheet.getRoot();

      if (businessObject.input && businessObject.input.length) {
        return;
      }

      if (cellType === 'before-label-cells') {
        return CreateInputsHeaderCell;
      } else if (cellType === 'before-rule-cells') {
        return CreateInputsCell;
      }
    });
  }
}

CreateInputsProvider.$inject = [ 'components', 'sheet' ];