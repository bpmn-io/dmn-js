import AllowedValuesEditing from './components/AllowedValuesEditing';

const LOW_PRIORITY = 500;


export default class InputOutputValues {
  constructor(components) {
    components.onGetComponent('context-menu', LOW_PRIORITY, (context = {}) => {
      const { contextMenuType } = context;

      if (contextMenuType === 'input-edit' || contextMenuType === 'output-edit') {
        return AllowedValuesEditing;
      }
    });
  }
}

InputOutputValues.$inject = [ 'components' ];