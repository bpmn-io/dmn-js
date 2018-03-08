import HitPolicyCell from './components/HitPolicyCell';
import HitPolicyCellContextMenu from './components/HitPolicyCellContextMenu';


export default function HitPolicyProviderEditing(
    components, contextMenu,
    eventBus, renderer
) {

  components.onGetComponent('cell', ({ cellType }) => {
    if (cellType === 'before-label-cells') {
      return HitPolicyCell;
    }
  });

  components.onGetComponent('context-menu', (context = {}) => {
    if (context.contextMenuType && context.contextMenuType === 'hit-policy-edit') {
      return HitPolicyCellContextMenu;
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

HitPolicyProviderEditing.$inject = [
  'components',
  'contextMenu',
  'eventBus',
  'renderer'
];