import { query as domQuery } from 'min-dom';

import { isString } from 'min-dash/lib/lang';

import DescriptionEditor from './components/DescriptionEditor';

const LOW_PRIORITY = 500;

const OFFSET_X = 26;

export default class Description {
  constructor(components, contextMenu, elementRegistry, eventBus, modeling, renderer) {
    this._contextMenu = contextMenu;
    this._modeling = modeling;
    this._renderer = renderer;

    eventBus.on('cell.click', ({ event, id, node }) => {
      const container = renderer.getContainer(),
            bounds = node.getBoundingClientRect();

      const position = getPosition(container, bounds);

      contextMenu.open(position, {
        contextMenuType: 'cell-description',
        id
      });
    });

    components.onGetComponent('context-menu', (context = {}) => {
      if (context.contextMenuType
        && context.contextMenuType === 'cell-description') {
        return DescriptionEditor;
      }
    });

    components.onGetComponent('context-menu-cell-additional', LOW_PRIORITY,
      (context = {}) => {
        if (context.contextMenuType
          && context.contextMenuType === 'context-menu') {

          const { id } = context;

          if (!id) {
            return;
          }

          const element = elementRegistry.get(id);

          // element might not be in element registry (e.g. cut)
          if (!element) {
            return;
          }

          const { businessObject } = element;

          const { description } = businessObject;

          const existingDescription = isString(description);

          const className =
            existingDescription
              ? 'remove-description'
              : 'add-description';

          const onClick =
            existingDescription
              ? () => this.removeDescription(element)
              : () => this.addDescription(element);

          const icon =
            existingDescription
              ? 'dmn-icon-clear'
              : 'dmn-icon-plus';

          return (
            <div
              className={ `context-menu-group-entry ${ className }` }
              onClick={ onClick }>
              <span className={ `context-menu-group-entry-icon ${ icon }` }></span>
              { isString(description) ? 'Remove' : 'Add' } Description
            </div>
          );
        }
      });
  }

  addDescription = (cell) => {
    this._modeling.updateProperties(cell, {
      description: ''
    });

    const node = domQuery(`[data-element-id="${ cell.id }"]`);

    const container = this._renderer.getContainer(),
          bounds = node.getBoundingClientRect();

    const position = getPosition(container, bounds);

    this._contextMenu.open(position, {
      contextMenuType: 'cell-description',
      id: cell.id,
      autoFocus: true
    });
  }

  removeDescription = (cell) => {
    this._modeling.updateProperties(cell, {
      description: null
    });

    this._contextMenu.close();
  }
}

Description.$inject = [
  'components',
  'contextMenu',
  'elementRegistry',
  'eventBus',
  'modeling',
  'renderer'
];

// helpers //////////

function getPosition(container, bounds) {
  const { top, left, width, height } = bounds;

  return {
    x: left + container.parentNode.scrollLeft - OFFSET_X,
    y: top + container.parentNode.scrollTop,
    width: width + (2 * OFFSET_X),
    height
  };
}