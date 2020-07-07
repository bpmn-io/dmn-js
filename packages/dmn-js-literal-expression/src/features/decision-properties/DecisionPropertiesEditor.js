import DecisionPropertiesEditorComponent
  from './components/DecisionPropertiesEditorComponent';

const HIGH_PRIORITY = 1500;

export default class DecisionPropertiesEditor {
  constructor(components) {
    components.onGetComponent('viewer', HIGH_PRIORITY, () => {
      return DecisionPropertiesEditorComponent;
    });
  }
}

DecisionPropertiesEditor.$inject = [ 'components' ];