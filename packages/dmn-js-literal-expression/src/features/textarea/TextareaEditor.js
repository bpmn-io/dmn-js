import TextareaEditorComponent from './components/TextareaEditorComponent';

export default class Textarea {
  constructor(components) {
    components.onGetComponent('viewer', () => TextareaEditorComponent);
  }
}

Textarea.$inject = [ 'components' ];