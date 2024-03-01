import ElementVariableComponent from './components/ElementVariableComponent';

export default class ElementVariable {
  $inject = [ 'components' ];

  constructor(components) {
    components.onGetComponent('footer', () => ElementVariableComponent);
  }
}
