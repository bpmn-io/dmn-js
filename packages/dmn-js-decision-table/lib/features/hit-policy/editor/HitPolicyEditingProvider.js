import {
  closest as domClosest
} from 'min-dom';

import EditableHitPolicyCell from './components/EditableHitPolicyCell';
import HitPolicyCellContextMenu from './components/HitPolicyCellContextMenu';


export default function HitPolicyEditingProvider(
    components, contextMenu,
    eventBus, renderer
) {

  components.onGetComponent('cell', ({ cellType }) => {
    if (cellType === 'before-label-cells') {
      return EditableHitPolicyCell;
    }
  });

  components.onGetComponent('context-menu', (context = {}) => {
    if (context.contextMenuType && context.contextMenuType === 'hit-policy-edit') {
      return HitPolicyCellContextMenu;
    }
  });

  eventBus.on('hitPolicy.edit', ({ event }) => {
    const node = domClosest(event.target, 'th', true);

    const { left, top, width, height } = node.getBoundingClientRect();

    const container = renderer.getContainer();

    contextMenu.open({
      x: left + container.parentNode.scrollLeft,
      y: top + container.parentNode.scrollTop,
      width,
      height
    }, {
      contextMenuType: 'hit-policy-edit',
      offset: {
        x: 4,
        y: 4
      }
    });
  });
}

HitPolicyEditingProvider.$inject = [
  'components',
  'contextMenu',
  'eventBus',
  'renderer'
];