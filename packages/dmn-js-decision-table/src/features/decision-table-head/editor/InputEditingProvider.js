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

      const { left, top, width, height } = node.getBoundingClientRect();

      const container = renderer.getContainer();

      contextMenu.open({
        x: left + container.parentNode.scrollLeft,
        y: top + container.parentNode.scrollTop,
        width,
        height
      }, {
        contextMenuType: 'input-edit',
        input,
        offset: {
          x: 4,
          y: 4
        }
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