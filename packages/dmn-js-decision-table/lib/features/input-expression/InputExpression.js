import InputExpressionCellComponent from './components/InputExpressionCellComponent';
import InputExpressionContextMenuComponent from './components/InputExpressionContextMenuComponent';

export default class InputExpression {
  constructor(components, contextMenu, eventBus, renderer) {
    components.onGetComponent('cell', ({ cellType }) => {
      if (cellType === 'input-expression') {
        return InputExpressionCellComponent;
      }
    });

    components.onGetComponent('context-menu', (context = {}) => {
      if (context.contextMenuType && context.contextMenuType === 'input-expression-edit') {
        return InputExpressionContextMenuComponent;
      }
    });

    eventBus.on('inputExpression.edit', ({ event, node, inputExpression }) => {
      const { left, top, width, height } = node.getBoundingClientRect();

      const container = renderer.getContainer();

      contextMenu.open({
        x: left + container.parentNode.scrollLeft,
        y: top + container.parentNode.scrollTop,
        width,
        height
      }, {
        contextMenuType: 'input-expression-edit',
        inputExpression
      });
    });
  }
}

InputExpression.$inject = [ 'components', 'contextMenu',  'eventBus', 'renderer' ];