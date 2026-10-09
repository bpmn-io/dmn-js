import HitPolicy from './components/HitPolicy';

export default function HitPolicyProvider(components) {
  components.onGetComponent('hit-policy', () => {
    return HitPolicy;
  });
}

HitPolicyProvider.$inject = [ 'components' ];