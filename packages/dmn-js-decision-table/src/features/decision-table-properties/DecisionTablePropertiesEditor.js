import Component from './components/DecisionTablePropertiesEditorComponent';

export default class DecisionTableProperties {
  constructor(components) {
    components.onGetComponent('table.header', () => {
      return Component;
    });
  }
}

DecisionTableProperties.$inject = [ 'components' ];