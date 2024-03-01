import ElementPropertiesComponent from './components/ElementPropertiesComponent';

export default class ElementProperties {
  constructor(components) {
    components.onGetComponent('header', () => ElementPropertiesComponent);
  }
}

ElementProperties.$inject = [ 'components' ];