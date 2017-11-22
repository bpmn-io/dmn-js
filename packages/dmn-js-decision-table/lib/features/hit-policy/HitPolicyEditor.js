import HitPolicyEditorCellComponent from './components/HitPolicyEditorCellComponent';

export default class HitPolicy {
  constructor(components) {
    components.onGetComponent('cell', ({ cellType }) => {
      if (cellType === 'before-label-cells') {
        return HitPolicyEditorCellComponent;
      }
    });
  }
}

HitPolicy.$inject = [ 'components' ];