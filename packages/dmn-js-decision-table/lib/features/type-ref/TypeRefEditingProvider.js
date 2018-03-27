import {
  closest as domClosest
} from 'min-dom';

import TypeRefCell from './components/TypeRefCell';
import TypeRefCellContextMenu from './components/TypeRefCellContextMenu';

export default class TypeRef {

  constructor(components, contextMenu, eventBus, renderer) {

    components.onGetComponent('cell', ({ cellType }) => {
      if (cellType === 'input-header-type-ref' ||
          cellType === 'output-header-type-ref') {
        return TypeRefCell;
      }
    });

    components.onGetComponent('context-menu', (context = {}) => {
      if (context.contextMenuType && context.contextMenuType === 'type-ref-edit') {
        return TypeRefCellContextMenu;
      }
    });

    eventBus.on('typeRef.edit', ({ event, element }) => {
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
        contextMenuType: 'type-ref-edit',
        element,
        offset: {
          x: 4,
          y: 4
        }
      });
    });
  }

}

TypeRef.$inject = [
  'components',
  'contextMenu',
  'eventBus',
  'renderer'
];