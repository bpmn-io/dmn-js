import {
  classes as domClasses,
  domify,
  query as domQuery,
  remove as domRemove
} from 'min-dom';

import { isInput, isOutput } from 'dmn-js-shared/lib/util/ModelUtil';

import { Row, Col } from 'table-js/lib/model';

import { forEach } from 'min-dash/lib/collection';

const TOP = 'top',
      RIGHT = 'right',
      BOTTOM = 'bottom',
      LEFT = 'left';


export default class DragAndDrop {

  constructor(
      components, elementRegistry, eventBus,
      dragAndDrop, renderer, rules, sheet) {

    this._elementRegistry = elementRegistry;
    this._dragAndDrop = dragAndDrop;
    this._renderer = renderer;
    this._rules = rules;
    this._sheet = sheet;

    // provide drag handle for drag and drop
    components.onGetComponent('cell-inner', ({ cellType, col, row }) => {
      if (cellType === 'rule-index') {
        return () => <span
          draggable="true"
          onDragStart={ e => this.startDrag(row, e) }
          className="dmn-icon-drag vertical"
          title="Move rule">&nbsp;</span>;
      } else if (cellType === 'input-cell' || cellType === 'output-cell') {

        let title = `Move ${isInput(col) ? 'Input' : 'Output' }`;

        return () => <span
          draggable="true"
          onDragStart={ e => this.startDrag(col, e) }
          className="dmn-icon-drag horizontal"
          title={ title }></span>;
      }
    });

    // validate allowed rules
    eventBus.on('dragAndDrop.dragEnter', (event) => {

      const {
        dragContext
      } = event;

      const {
        draggedElement,
        hoverEl
      } = dragContext;

      // can always drag rows
      if (draggedElement instanceof Row) {
        return true;
      }

      if (draggedElement instanceof Col) {
        const dropIndex = getTargetColIndex(hoverEl, this._elementRegistry, this._sheet);

        // cannot drop as we cannot compute the drop index
        if (dropIndex === -1) {
          return false;
        }

        const allowed = this._rules.allowed('col.move', {
          col: draggedElement,
          index: dropIndex
        });

        return allowed;
      }

      return false;
    });

    // update UI
    eventBus.on('dragAndDrop.dragOver', (event) => {

      const {
        dragContext,
        originalEvent
      } = event;

      const {
        draggedElement,
        targetEl
      } = dragContext;

      const container = this._renderer.getContainer();

      if (!targetEl) {
        return false;
      }

      if (draggedElement instanceof Row) {
        const verticalPosition = getVerticalPosition(
          originalEvent,
          targetEl
        );

        if (dragContext._lastTargetEl !== targetEl
          || dragContext._lastPosition !== verticalPosition) {

          removeHighlight(container);

          if (verticalPosition === TOP) {

            // drop above
            highlightRow(targetEl, container, 'top');
          } else {

            // drop below
            highlightRow(targetEl, container, 'bottom');
          }
        }

        dragContext._lastPosition = verticalPosition;
      }

      if (draggedElement instanceof Col) {
        const horizontalPosition = getHorizontalPosition(
          originalEvent,
          targetEl
        );

        if (dragContext._lastTargetEl !== targetEl
          || dragContext._lastPosition !== horizontalPosition) {

          removeHighlight(container);

          if (horizontalPosition === LEFT) {

            // drop left
            highlightCol(targetEl, container, 'left');
          } else {

            // drop right
            highlightCol(targetEl, container, 'right');
          }
        }

        dragContext._lastPosition = horizontalPosition;
      }

      dragContext._lastTargetEl = targetEl;

      // allowed
      return true;
    });


    // perform drop operation
    eventBus.on('dragAndDrop.drop', (event) => {

      const {
        dragContext,
        originalEvent
      } = event;

      const {
        draggedElement,
        targetEl
      } = dragContext;

      if (!targetEl) {
        return false;
      }

      if (draggedElement instanceof Row) {
        const verticalPosition = getVerticalPosition(
          originalEvent,
          targetEl
        );

        const rowId = targetEl.dataset.rowId,
              row = this._elementRegistry.get(rowId);

        if (!row || row === draggedElement) {
          return;
        }

        const targetRow = getTargetRow(
          draggedElement,
          row,
          verticalPosition,
          this._sheet.getRoot().rows
        );

        if (targetRow === draggedElement) {
          return;
        }

        return targetRow;
      }

      if (draggedElement instanceof Col) {
        const horizontalPosition = getHorizontalPosition(
          originalEvent,
          targetEl
        );

        // no need to check rules; we verified on
        // dragEnter that dropping is O.K.
        const colId = targetEl.dataset.colId,
              col = this._elementRegistry.get(colId);

        if (!col || col === draggedElement) {
          return;
        }

        const targetCol = getTargetCol(
          draggedElement,
          col,
          horizontalPosition,
          this._sheet.getRoot().cols
        );

        if (targetCol === draggedElement) {
          return;
        }

        return targetCol;
      }
    });

    eventBus.on('dragAndDrop.dragEnd', this._cleanup);
  }

  startDrag(element, event) {
    const container = this._renderer.getContainer();

    this._dragImage = domify(
      `<span style="
          visibility: hidden;
          position: fixed;
          top: -10000px
      "></span>`
    );

    // needs to be present in DOM
    document.body.appendChild(this._dragImage);

    // QUIRK: not supported by Edge and Internet Explorer
    if (event.dataTransfer.setDragImage) {
      event.dataTransfer.setDragImage(this._dragImage, 0, 0);
    }

    if (element instanceof Row) {
      fadeOutRow(element, container);
    } else if (element instanceof Col) {
      fadeOutCol(element, container);
    }

    this._dragAndDrop.startDrag(element, event);
  }

  _cleanup = () => {
    const container = this._renderer.getContainer();

    removeHighlight(container);
    removeFadeOut(container);

    if (this._dragImage) {
      domRemove(this._dragImage);

      this._dragImage = null;
    }
  }

}

DragAndDrop.$inject = [
  'components',
  'elementRegistry',
  'eventBus',
  'dragAndDrop',
  'renderer',
  'rules',
  'sheet'
];

// helpers //////////

function getTargetColIndex(cellEl, elementRegistry, sheet) {
  const targetCol = elementRegistry.get(cellEl.dataset.colId);

  if (!targetCol) {
    return -1;
  }

  const { cols } = sheet.getRoot();

  return cols.indexOf(targetCol);
}

function highlightRow(dragOverCell, container, position) {
  const rowId = dragOverCell.dataset.rowId;

  if (!rowId) {
    return;
  }

  const cells = domQuery.all(`[data-row-id=${rowId}]`, container);

  forEach(cells, cell => {

    // QUIRK: PhantomJS might return object instead of NodeList
    if (isNode(cell)) {
      domClasses(cell).add('dragover');
      domClasses(cell).add(position);
    }
  });
}

function highlightCol(dragOverCell, container, position) {
  const colId = dragOverCell.dataset.colId;

  if (!colId) {
    return;
  }

  const cells = domQuery.all(`[data-col-id=${colId}]`, container);

  forEach(cells, cell => {

    // QUIRK: PhantomJS might return object instead of NodeList
    if (isNode(cell)) {
      domClasses(cell).add('dragover');
      domClasses(cell).add(position);
    }
  });
}

function removeHighlight(container) {
  const cells = domQuery.all('.dragover', container);

  forEach(cells, cell => {

    // QUIRK: PhantomJS might return object instead of NodeList
    if (isNode(cell)) {
      domClasses(cell).remove('dragover');
      domClasses(cell).remove('top');
      domClasses(cell).remove('right');
      domClasses(cell).remove('bottom');
      domClasses(cell).remove('left');
    }
  });
}

function fadeOutRow(row, container) {
  const cells = domQuery.all(`[data-row-id=${row.id}]`, container);

  forEach(cells, cell => {

    // QUIRK: PhantomJS might return object instead of NodeList
    if (isNode(cell)) {
      domClasses(cell).add('dragged');
    }
  });
}

function fadeOutCol(col, container) {
  const cells = domQuery.all(`[data-col-id=${col.id}]`, container);

  forEach(cells, cell => {

    // QUIRK: PhantomJS might return object instead of NodeList
    if (isNode(cell)) {
      domClasses(cell).add('dragged');
    }
  });
}

function removeFadeOut(container) {
  const cells = domQuery.all('.dragged', container);

  forEach(cells, cell => {

    // QUIRK: PhantomJS might return object instead of NodeList
    if (isNode(cell)) {
      domClasses(cell).remove('dragged');
    }
  });
}

function getHorizontalPosition(event, dragOverElement) {
  const bounds = dragOverElement.getBoundingClientRect();

  return event.clientX < (bounds.left + bounds.width / 2)
    ? LEFT
    : RIGHT;
}

function getVerticalPosition(event, dragOverElement) {
  const bounds = dragOverElement.getBoundingClientRect();

  return event.clientY < (bounds.top + bounds.height / 2)
    ? TOP
    : BOTTOM;
}

function getTargetRow(draggedRow, targetRow, verticalPosition, rows) {
  if (rows.indexOf(draggedRow) > rows.indexOf(targetRow)) {
    targetRow = getRowBelow(targetRow, rows);
  }

  if (verticalPosition === TOP) {

    // return row above or row
    return getRowAbove(targetRow, rows);
  } else {

    // return row
    return targetRow;
  }
}

function getTargetCol(draggedCol, targetCol, horizontalPosition, cols) {
  if (cols.indexOf(draggedCol) > cols.indexOf(targetCol)) {
    targetCol = getColRight(targetCol, cols);
  }

  if (horizontalPosition === LEFT) {

    // return col left or col
    return getColLeft(targetCol, cols);
  } else {

    // return col
    return targetCol;
  }
}

function getRowAbove(row, rows) {
  const index = rows.indexOf(row);

  return rows[ Math.max(0, index - 1) ];
}

function getRowBelow(row, rows) {
  const index = rows.indexOf(row);

  return rows[ Math.min(rows.length - 1, index + 1) ];
}

function getColLeft(col, cols) {
  const index = cols.indexOf(col);

  if (isOutput(col)) {
    const firstOutput = cols.filter(col => isOutput(col))[0];

    const firstOutputIndex = cols.indexOf(firstOutput);

    return cols[ Math.max(firstOutputIndex, index - 1) ];
  }

  return cols[ Math.max(0, index - 1) ];
}

function getColRight(col, cols) {
  const index = cols.indexOf(col);

  if (isInput(col)) {
    const inputs = cols.filter(col => isInput(col));

    const lastInput = inputs[ inputs.length - 1 ];

    const lastInputIndex = cols.indexOf(lastInput);

    return cols[ Math.min(lastInputIndex, index + 1) ];
  }

  return cols[ Math.min(cols.length - 1, index + 1) ];
}

// QUIRK: PhantomJS requires check if actual DOM node
function isNode(node) {
  return node && (node.nodeType === 1 || node.nodeType == 11);
}