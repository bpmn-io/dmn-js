import HitPolicyEditorCellComponent from './components/HitPolicyEditorCellComponent';
import HitPolicyContextMenuComponent from './components/HitPolicyContextMenuComponent';

export default class HitPolicy {
  constructor(components, contextMenu, eventBus, renderer) {
    components.onGetComponent('cell', ({ cellType }) => {
      if (cellType === 'before-label-cells') {
        return HitPolicyEditorCellComponent;
      }
    });

    components.onGetComponent('context-menu', (context = {}) => {
      if (context.contextMenuType && context.contextMenuType === 'hit-policy-edit') {
        return HitPolicyContextMenuComponent;
      }
    });

    eventBus.on('hitPolicy.edit', ({ event, node }) => {
      const { left, top, width, height } = node.getBoundingClientRect();

      const container = renderer.getContainer();

      contextMenu.open({
        x: left + container.parentNode.scrollLeft,
        y: top + container.parentNode.scrollTop,
        width,
        height
      }, {
        contextMenuType: 'hit-policy-edit'
      });
    });
  }
}

HitPolicy.$inject = [ 'components', 'contextMenu', 'eventBus', 'renderer' ];