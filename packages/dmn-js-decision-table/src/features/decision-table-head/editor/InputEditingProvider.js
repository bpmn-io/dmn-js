import {
  closest as domClosest
} from 'min-dom';

import InputCell from './components/InputCell';
import InputCellContextMenu from './components/InputCellContextMenu';


export default class InputCellProvider {

  constructor(components, contextMenu, eventBus, renderer) {

    components.onGetComponent('cell', ({ cellType }) => {
      if (cellType === 'input-header') {
        return InputCell;
      }
    });

    components.onGetComponent('context-menu', (context = {}) => {
      if (
        context.contextMenuType === 'input-edit'
      ) {
        return InputCellContextMenu;
      }
    });

    eventBus.on('input.edit', ({ event, input }) => {
      const { target } = event;

      const node = domClosest(target, 'th', true);

      const { left, top } = node.getBoundingClientRect();

      contextMenu.open({
        x: left,
        y: top,
        align: 'bottom-right'
      }, {
        contextMenuType: 'input-edit',
        input
      });
    });
  }

}

InputCellProvider.$inject = [
  'components',
  'contextMenu',
  'eventBus',
  'renderer'
];