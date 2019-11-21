import DecisionTableHead from './components/DecisionTableHead';

export default function DecisionTableHeadProvider(components, translate) {
  this._translate = translate;
  components.onGetComponent('table.head', () => DecisionTableHead);
}

DecisionTableHeadProvider.$inject = [ 'components', 'translate' ];