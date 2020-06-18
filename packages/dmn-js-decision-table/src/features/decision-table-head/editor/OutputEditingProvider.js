import {
  closest as domClosest,
  matches as domMatches
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

      const { left, top } = node.getBoundingClientRect();

      const offset = getOffset(node);

      contextMenu.open({
        x: left,
        y: top,
        align: 'bottom-right'
      }, {
        contextMenuType: 'output-edit',
        output,
        offset
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

function getOffset(element) {
  if (!domMatches(element, '.output-cell + .output-cell')) {
    return { x: -1, y: 0 };
  }
}