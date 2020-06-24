import Component from './components/DecisionTablePropertiesEditorComponent';

export default class DecisionTableProperties {
  constructor(components) {
    components.onGetComponent('table.before', () => {
      return Component;
    });
  }
}

DecisionTableProperties.$inject = [ 'components' ];