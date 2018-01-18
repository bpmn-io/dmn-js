import RulesBodyComponent from './components/RulesBodyComponent';
import RulesRowComponent from './components/RulesRowComponent';
import RulesCellComponent from './components/RulesCellComponent';


export default class Rules {

  constructor(components) {
    components.onGetComponent('table.body', () => RulesBodyComponent);

    components.onGetComponent('row', ({ rowType }) => {
      if (rowType === 'rule') {
        return RulesRowComponent;
      }
    });

    components.onGetComponent('cell', ({ cellType }) => {
      if (cellType === 'rule') {
        return RulesCellComponent;
      }
    });
  }

}

Rules.$inject = [ 'components' ];