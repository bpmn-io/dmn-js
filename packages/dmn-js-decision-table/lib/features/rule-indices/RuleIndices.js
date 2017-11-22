import RuleIndexCellComponent from './components/RuleIndexCellComponent';

export default class RuleIndices {
  constructor(components) {
    components.onGetComponent('cell', ({ cellType }) => {
      if (cellType === 'before-rule-cells') {
        return RuleIndexCellComponent;
      }
    });
  }
}

RuleIndices.$inject = [ 'components' ];