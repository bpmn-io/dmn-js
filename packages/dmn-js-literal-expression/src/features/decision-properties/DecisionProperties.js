import DecisionPropertiesComponent from './components/DecisionPropertiesComponent';

const HIGH_PRIORITY = 1500;

export default class DecisionProperties {
  constructor(components) {
    components.onGetComponent('viewer', HIGH_PRIORITY, () => DecisionPropertiesComponent);
  }
}

DecisionProperties.$inject = [ 'components' ];