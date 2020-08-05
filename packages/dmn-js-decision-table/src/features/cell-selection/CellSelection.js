import {
  ensureFocus,
  findSelectableAncestor,
  getElementCoords,
  getElementId,
  getNodeByCoords,
  getNodeById,
  isUnselectableNode
} from './CellSelectionUtil';

const LOW_PRIORITY = 500;

const VALID_DIRECTIONS = {
  above: true,
  below: true,
  right: true,
  left: true
};


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

    if (isUnselectableNode(target)) {
      return;
    }

    const selectableNode = findSelectableAncestor(target);

    const elementId = selectableNode && getElementId(selectableNode);

    const focussed = !event.defaultPrevented;

    realSelect(elementId, focussed);
  }

  function focus(event) {
    const elementId = getElementId(event.target);

    const focussed = !event.defaultPrevented;

    event.stopPropagation();

    return realSelect(elementId, focussed);
  }

  function unfocus(event) {
    const elementId = getElementId(event.target);

    emit(elementId, {
      focussed: false
    });
  }

  function realSelect(elementId, focussed = true) {

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
        focussed
      });
    }

    if (elementId) {
      selection.select(elementId);
    } else {
      selection.deselect();
    }
  }

  eventBus.on('cell.click', LOW_PRIORITY, click);
  eventBus.on('cell.focusin', LOW_PRIORITY, focus);
  eventBus.on('cell.focusout', LOW_PRIORITY, unfocus);

  eventBus.on('cellSelection.changed', function(event) {

    const {
      elementId,
      selection
    } = event;

    const actualElement = getNodeById(elementId, container);

    if (selection.focussed && actualElement) {
      ensureFocus(actualElement);
    }
  });

  eventBus.on('selection.changed', function(event) {

    const {
      selection,
      oldSelection
    } = event;

    var elementId = selection && selection.id;
    var oldElementId = oldSelection && oldSelection.id;

    // select new element
    if (elementId && elementId !== lastSelection) {
      realSelect(selection.id);
    } else

    // deselect old element
    if (oldElementId && oldElementId === lastSelection) {
      realSelect();
    }

  });

  // API //////////////////////

  /**
   * Return true if a cell is currently selected.
   *
   * @return {boolean}
   */
  this.isCellSelected = function() {
    return !!lastSelection;
  };

  /**
   * Get the currently active cellSelection.
   *
   * @return {string} selection
   */
  this.getCellSelection = function() {
    return lastSelection;
  };

  /**
   * Select next cell in given direction.
   *
   * Returns true on success; false on fail (i.e. if no next selection
   * in direction could be found).
   *
   * @param {string} direction
   *
   * @return {boolean}
   */
  this.selectCell = function(direction) {

    if (!lastSelection) {
      return;
    }

    if (!(direction in VALID_DIRECTIONS)) {
      throw new Error('direction must be any of { above, below, left, right }');
    }

    var selectionEl = getNodeById(lastSelection, container);

    const coords = getElementCoords(selectionEl);

    if (!coords) {
      return false;
    }

    const nextCoords = getNextCoords(coords, direction);

    const nextNode = getNodeByCoords(nextCoords, container);

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


  eventBus.on('contextMenu.close', function() {

    if (lastSelection) {
      return realSelect(lastSelection);
    }

  });

}

CellSelection.$inject = [
  'config.renderer',
  'eventBus',
  'sheet',
  'selection',
  'elementRegistry'
];



// helpers ////////////////

function getNextCoords(coords, direction) {

  const {
    row,
    col
  } = coords;

  if (direction === 'above' || direction === 'below') {

    const rowIndex = parseInt(row, 10);

    if (isNaN(rowIndex)) {
      return coords;
    }

    const nextRowIndex = direction === 'above' ? rowIndex - 1 : rowIndex + 1;

    return {
      col,
      row: nextRowIndex
    };
  }

  if (direction === 'left' || direction === 'right') {

    const colIndex = parseInt(col, 10);

    if (isNaN(colIndex)) {
      return coords;
    }

    const nextColIndex = direction === 'left' ? colIndex - 1 : colIndex + 1;

    return {
      row,
      col: nextColIndex
    };
  }

  throw new Error('invalid direction <' + direction + '>');
}