import CreateInputsHeaderCell from './components/CreateInputHeaderCell';
import CreateInputsCell from './components/CreateInputCell';

const LOW_PRIORITY = 500;

export default class CreateInputsProvider {
  constructor(components) {
    components.onGetComponent('cell', LOW_PRIORITY, ({ cellType, root, row }) => {
      if (cellType !== 'before-label-cells' && cellType !== 'before-rule-cells') {
        return;
      }

      const { businessObject } = root || row.root;

      if (businessObject.input && businessObject.input.length) {
        return;
      }

      if (cellType === 'before-label-cells') {
        return CreateInputsHeaderCell;
      } else {
        return CreateInputsCell;
      }
    });
  }
}

CreateInputsProvider.$inject = [ 'components' ];