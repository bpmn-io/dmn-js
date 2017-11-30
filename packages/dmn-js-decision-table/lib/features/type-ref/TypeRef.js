import TypeRefCell from './components/TypeRefCell';
import TypeRefContextMenuComponent from './components/TypeRefContextMenuComponent';

export default class TypeRef {
  
  constructor(components, contextMenu, eventBus, renderer) {
    components.onGetComponent('cell', ({ cellType }) => {
      if (cellType === 'input-expression-type-ref' ||
          cellType === 'output-type-ref') {
        return TypeRefCell;
      }
    });

    components.onGetComponent('context-menu', (context = {}) => {
      if (context.contextMenuType && context.contextMenuType === 'type-ref-edit') {
        return TypeRefContextMenuComponent;
      }
    });

    eventBus.on('typeRef.edit', ({ event, node, element }) => {
      const { left, top, width, height } = node.getBoundingClientRect();

      const container = renderer.getContainer();

      contextMenu.open({
        x: left + container.parentNode.scrollLeft,
        y: top + container.parentNode.scrollTop,
        width,
        height
      }, {
        contextMenuType: 'type-ref-edit',
        element
      });
    });
  }

}

TypeRef.$inject = [ 'components', 'contextMenu', 'eventBus', 'renderer' ];