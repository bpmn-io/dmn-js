import ElementPropertiesEditorComponent
  from './components/ElementPropertiesEditorComponent';

export default class ElementPropertiesEditor {
  constructor(components) {
    components.onGetComponent('header', () => {
      return ElementPropertiesEditorComponent;
    });
  }
}

ElementPropertiesEditor.$inject = [ 'components' ];