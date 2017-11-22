import HitPolicyCellComponent from './components/HitPolicyCellComponent';

export default class HitPolicy {
  constructor(components) {
    components.onGetComponent('cell', ({ cellType }) => {
      if (cellType === 'before-label-cells') {
        return HitPolicyCellComponent;
      }
    });
  }
}

HitPolicy.$inject = [ 'components' ];