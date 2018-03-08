import AllowedValuesEditing from './components/AllowedValuesEditing';

const LOW_PRIORITY = 500;


export default class InputOutputValues {
  constructor(components) {
    components.onGetComponent('context-menu', LOW_PRIORITY, (context = {}) => {
      if (context.contextMenuType && context.contextMenuType === 'type-ref-edit') {
        return AllowedValuesEditing;
      }
    });
  }
}

InputOutputValues.$inject = [ 'components' ];