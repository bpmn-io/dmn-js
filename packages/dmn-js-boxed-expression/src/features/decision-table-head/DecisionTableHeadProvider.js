import DecisionTableHead from './components/DecisionTableHead';

export default function DecisionTableHeadProvider(components) {
  components.onGetComponent('table.head', () => DecisionTableHead);
}

DecisionTableHeadProvider.$inject = [ 'components' ];