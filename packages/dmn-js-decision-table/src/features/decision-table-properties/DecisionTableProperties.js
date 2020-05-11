import Component from './components/DecisionTablePropertiesComponent';

export default class DecisionTableProperties {
  constructor(components) {
    components.onGetComponent('table.header', () => {
      return Component;
    });
  }
}

DecisionTableProperties.$inject = [ 'components' ];