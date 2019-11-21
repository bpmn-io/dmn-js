import { isString } from 'min-dash';

import {
  getNodeById
} from '../cell-selection/CellSelectionUtil';

import DescriptionEditor from './components/DescriptionEditor';

const LOW_PRIORITY = 500;

const LOWER_PRIORITY = 750;

const OFFSET_X = 26;


export default class Description {

  constructor(
      components, contextMenu, elementRegistry,
      eventBus, modeling, renderer, translate) {

    this._contextMenu = contextMenu;
    this._modeling = modeling;
    this._renderer = renderer;
    this._translate = translate;


    eventBus.on('cell.click', LOWER_PRIORITY, (event) => {

      if (event.defaultPrevented) {
        return;
      }

      const {
        target,
        id
      } = event;

      const element = elementRegistry.get(id);

      if (!element) {
        return;
      }

      const description = getDescription(element);

      if (!description) {

        // prevent focus
        event.preventDefault();
      }

      const container = renderer.getContainer(),
            bounds = target.getBoundingClientRect();

      const position = getPosition(container, bounds);

      contextMenu.open(position, {
        contextMenuType: 'cell-description',
        autoFocus: false,
        id,
        offset: {
          x: 4,
          y: 4
        }
      });
    });

    components.onGetComponent('context-menu', (context = {}) => {
      if (context.contextMenuType
        && context.contextMenuType === 'cell-description') {

        const element = elementRegistry.get(context.id);

        const description = getDescription(element);

        if (isString(description)) {
          return DescriptionEditor;
        }
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
              {
                isString(description)
                  ?
                  this._translate('Remove')
                  :
                  this._translate('Add')
              }
              { this._translate('Description') }
            </div>
          );
        }
      });
  }

  addDescription = (cell) => {
    this._modeling.updateProperties(cell, {
      description: ''
    });

    const container = this._renderer.getContainer();

    const node = getNodeById(cell.id, container);

    const bounds = node.getBoundingClientRect();

    const position = getPosition(container, bounds);

    this._contextMenu.open(position, {
      contextMenuType: 'cell-description',
      id: cell.id,
      autoFocus: true,
      offset: {
        x: 4,
        y: 4
      }
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
  'renderer',
  'translate'
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

function getDescription(element) {
  return element
    && element.businessObject
    && element.businessObject.description;
}