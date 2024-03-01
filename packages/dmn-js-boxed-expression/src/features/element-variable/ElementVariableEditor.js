import ElementVariableEditorComponent
  from './components/ElementVariableEditorComponent';

export default class ElementVariableEditor {
  $inject = [ 'components' ];

  constructor(components) {
    components.onGetComponent('footer', () => {
      return ElementVariableEditorComponent;
    });
  }
}
