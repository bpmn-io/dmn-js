import DecisionRulesBodyComponent from './components/DecisionRulesBodyComponent';
import DecisionRulesRowComponent from './components/DecisionRulesRowComponent';
import DecisionRulesCellComponent from './components/DecisionRulesCellComponent';


export default class Rules {

  constructor(components) {
    components.onGetComponent('table.body', () => DecisionRulesBodyComponent);

    components.onGetComponent('row', ({ rowType }) => {
      if (rowType === 'rule') {
        return DecisionRulesRowComponent;
      }
    });

    components.onGetComponent('cell', ({ cellType }) => {
      if (cellType === 'rule') {
        return DecisionRulesCellComponent;
      }
    });
  }

}

Rules.$inject = [ 'components' ];