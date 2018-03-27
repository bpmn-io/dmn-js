import {
  closest as domClosest
} from 'min-dom';

import OutputCell from './components/OutputCell';
import OutputCellContextMenu from './components/OutputCellContextMenu';


export default class OutputEditingProvider {

  constructor(components, contextMenu, eventBus, renderer) {

    components.onGetComponent('cell', ({ cellType }) => {
      if (cellType === 'output-header') {
        return OutputCell;
      }
    });

    components.onGetComponent('context-menu', (context = {}) => {
      if (
        context.contextMenuType === 'output-edit'
      ) {
        return OutputCellContextMenu;
      }
    });

    eventBus.on('output.edit', ({ event, output }) => {

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
        contextMenuType: 'output-edit',
        output,
        offset: {
          x: 4,
          y: 4
        }
      });
    });
  }

}

OutputEditingProvider.$inject = [
  'components',
  'contextMenu',
  'eventBus',
  'renderer'
];