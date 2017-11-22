import DecisionTablePropertiesEditorComponent from './components/DecisionTablePropertiesEditorComponent';

export default class DecisionTableProperties {
  constructor(components) {
    components.onGetComponent('table.before', () => {
      return DecisionTablePropertiesEditorComponent;
    });
  }
}

DecisionTableProperties.$inject = [ 'components' ];