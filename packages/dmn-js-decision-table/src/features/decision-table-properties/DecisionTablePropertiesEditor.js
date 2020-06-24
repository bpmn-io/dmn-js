import Component from './components/DecisionTablePropertiesEditorComponent';

const LOW_PRIORITY = 500;

export default class DecisionTableProperties {
  constructor(components) {
    components.onGetComponent('table.before', LOW_PRIORITY, () => {
      return Component;
    });
  }
}

DecisionTableProperties.$inject = [ 'components' ];