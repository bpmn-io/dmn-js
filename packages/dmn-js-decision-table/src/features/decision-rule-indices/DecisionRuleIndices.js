import DecisionRuleIndexCellComponent
  from './components/DecisionRuleIndexCellComponent';

export default class DecisionRuleIndices {
  constructor(components) {
    components.onGetComponent('cell', ({ cellType }) => {
      if (cellType === 'before-rule-cells') {
        return DecisionRuleIndexCellComponent;
      }
    });
  }
}

DecisionRuleIndices.$inject = [ 'components' ];