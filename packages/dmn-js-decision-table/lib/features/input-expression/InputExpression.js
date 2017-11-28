import InputExpressionCellComponent from './components/InputExpressionCellComponent';

export default class InputExpression {
  constructor(components) {
    components.onGetComponent('cell', ({ cellType }) => {
      if (cellType === 'input-expression') {
        return InputExpressionCellComponent;
      }
    });
  }
}

InputExpression.$inject = [ 'components' ];