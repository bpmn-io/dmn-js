import {
  delegate,
  event,
  query
} from 'min-dom';

import {
  ELEMENT_SELECTOR,
  ensureFocus,
  findSelectableAncestor,
  getElementCoords,
  getElementId,
  getNodeByCoords,
  getNodeById,
  isUnselectableNode
} from './CellSelectionUtil';


/**
 * A cell selection utlity; allows selection of elements, independent from
 * whether they are backed by a business object or not.
 *
 * Works together with the {@link SelectionAware} trait.
 *
 * @param {RenderConfig} config
 * @param {EventBus} eventBus
 * @param {Sheet} sheet
 * @param {Selection} selection
 * @param {ElementRegistry} elementRegistry
 */
export default function CellSelection(
    config, eventBus, sheet,
    selection, elementRegistry) {

  const {
    container
  } = config;

  let lastSelection = null;

  function emit(elementId, newSelection) {

    eventBus.fire('selection.' + elementId + '.changed', newSelection);

    eventBus.fire('cellSelection.changed', {
      elementId: elementId,
      selection: newSelection
    });

  }

  function click(event) {

    const target = event.target;

    const selectableNode = findSelectableAncestor(target);
    if (isUnselectableNode(target)) {
      return;
    }


    const elementId = selectableNode && getElementId(selectableNode);

    realSelect(elementId);
  }

  function focus(event) {
    const elementId = getElementId(event.delegateTarget);

    return realSelect(elementId);
  }

  function unfocus(event) {
    const elementId = getElementId(event.delegateTarget);

    emit(elementId, {
      focussed: false
    });
  }

  function realSelect(elementId) {

    if (lastSelection !== elementId) {
      emit(lastSelection, {
        selected: false,
        focussed: false
      });
    }

    lastSelection = elementId;

    if (elementId) {
      emit(elementId, {
        selected: true,
        focussed: true
      });
    }

    if (elementId) {
      selection.select(elementId);
    } else {
      selection.deselect();
    }
  }

  event.bind(container, 'click', click);
  delegate.bind(container, ELEMENT_SELECTOR, 'focusin', focus);
  delegate.bind(container, ELEMENT_SELECTOR, 'focusout', unfocus);


  eventBus.on('table.destroy', function() {
    event.unbind(container, 'click', click);
    delegate.unbind(container, ELEMENT_SELECTOR, 'focusin', focus);
    delegate.unbind(container, ELEMENT_SELECTOR, 'focusout', unfocus);
  });

  eventBus.on('cellSelection.changed', function(event) {

    const {
      elementId,
      selection
    } = event;

    const actualElement = query(`[data-element-id="${elementId}"]`, container);

    if (selection.selected && actualElement) {
      ensureFocus(actualElement);
    }
  });

  eventBus.on('selection.changed', function(event) {

    const {
      selection
    } = event;

    if (selection) {
      realSelect(selection.id);
    }
  });

  // API //////////////////////

  /**
   * Return true if a cell is currently selected.
   *
   * @return {Boolean} [description]
   */
  this.isCellSelected = function() {
    return !!lastSelection;
  };

  /**
   * Select next cell in given direction.
   *
   * Returns true on success; false on fail (i.e. if no next selection
   * in direction could be found).
   *
   * @param {String} direction
   *
   * @return {Boolean}
   */
  this.selectCell = function(direction) {

    if (!lastSelection) {
      return;
    }

    if (direction !== 'above' && direction !== 'below') {
      throw new Error('direction must be any of { above, below }');
    }

    var selectionEl = getNodeById(lastSelection, container);

    const coords = getElementCoords(selectionEl);

    if (!coords) {
      return false;
    }

    const {
      row,
      col
    } = coords;

    const rowIndex = parseInt(row, 10);

    const nextRowIndex = direction === 'above' ? rowIndex - 1 : rowIndex + 1;

    const nextNode = getNodeByCoords({
      row: nextRowIndex,
      col
    }, container);

    if (!nextNode) {
      return false;
    }

    const nextElId = getElementId(nextNode);

    if (nextElId) {
      realSelect(nextElId, {
        focussed: true,
        selected: true
      });
    }

    return true;
  };
}

CellSelection.$inject = [
  'config.renderer',
  'eventBus',
  'sheet',
  'selection',
  'elementRegistry'
];