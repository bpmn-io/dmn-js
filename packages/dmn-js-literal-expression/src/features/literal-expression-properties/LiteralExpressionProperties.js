import LiteralExpressionPropertiesComponent
  from './components/LiteralExpressionPropertiesComponent';

const LOW_PRIORITY = 500;

export default class DecisionProperties {
  constructor(components) {
    components.onGetComponent('viewer', LOW_PRIORITY, () => {
      return LiteralExpressionPropertiesComponent;
    });
  }
}

DecisionProperties.$inject = [ 'components' ];