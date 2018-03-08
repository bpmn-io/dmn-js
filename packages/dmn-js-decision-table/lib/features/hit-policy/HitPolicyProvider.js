import HitPolicyCell from './components/HitPolicyCell';

export default function HitPolicyProvider(components) {
  components.onGetComponent('cell', ({ cellType }) => {
    if (cellType === 'before-label-cells') {
      return HitPolicyCell;
    }
  });
}

HitPolicyProvider.$inject = [ 'components' ];