import LiteralExpressionPropertiesEditorComponent
  from './components/LiteralExpressionPropertiesEditorComponent';

const LOW_PRIORITY = 500;

export default class LiteralExpressionPropertiesEditor {
  constructor(components) {
    components.onGetComponent('viewer', LOW_PRIORITY, () => {
      return LiteralExpressionPropertiesEditorComponent;
    });
  }
}

LiteralExpressionPropertiesEditor.$inject = [ 'components' ];