import TextareaComponent from './components/TextareaComponent';

export default class Textarea {
  constructor(components) {
    components.onGetComponent('viewer', () => TextareaComponent);
  }
}

Textarea.$inject = [ 'components' ];