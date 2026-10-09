import EditableHitPolicy from './components/EditableHitPolicy';


export default function HitPolicyEditingProvider(
    components
) {

  components.onGetComponent('hit-policy', () => {
    return EditableHitPolicy;
  });
}

HitPolicyEditingProvider.$inject = [
  'components'
];
