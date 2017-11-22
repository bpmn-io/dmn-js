import DecisionTablePropertiesComponent from './components/DecisionTablePropertiesComponent';

export default class DecisionTableProperties {
  constructor(components) {
    components.onGetComponent('table.before', () => {
      return DecisionTablePropertiesComponent;
    });
  }
}

DecisionTableProperties.$inject = [ 'components' ];