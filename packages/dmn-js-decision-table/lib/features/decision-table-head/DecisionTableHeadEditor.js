import DecisionTableHeadComponent from './components/DecisionTableHeadComponent';
import InputExpressionCellComponent from './components/InputExpressionCellComponent';
import OutputNameComponent from './components/OutputNameComponent';

export default class DecisionTableHead {
  constructor(components) {
    components.onGetComponent('table.head', () => DecisionTableHeadComponent);

    components.onGetComponent('cell', ({ cellType }) => {
      if (cellType === 'input-expression') {
        return InputExpressionCellComponent;
      } else if (cellType === 'output-name') {
        return OutputNameComponent;
      }
    });
  }
}

DecisionTableHead.$inject = [ 'components' ];