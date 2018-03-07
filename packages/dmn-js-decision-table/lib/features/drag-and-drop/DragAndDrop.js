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
      components,
      elementRegistry,
      eventBus,
      dragAndDrop,
      renderer,
      rules,
      sheet) {
    this._elementRegistry = elementRegistry;
    this._dragAndDrop = dragAndDrop;
    this._renderer = renderer;
    this._rules = rules;
    this._sheet = sheet;

    this._currentDragOverElement = null;
    this._currentHighlightPosition = null;

    // provide drag handle for drag and drop
    components.onGetComponent('cell-inner', ({ cellType, col, row }) => {
      if (cellType === 'rule-index') {
        return () => <span
          draggable="true"
          onDragStart={ e => this.startDrag(row, e) }
          className="dmn-icon-drag vertical">&nbsp;</span>;
      } else if (cellType === 'input-cell' || cellType === 'output-cell') {
        return () => <span
          draggable="true"
          onDragStart={ e => this.startDrag(col, e) }
          className="dmn-icon-drag horizontal"></span>;
      }
    });

    eventBus.on('dragAndDrop.dragOver', ({ draggedElement, dragOverElement, event }) => {
      const container = this._renderer.getContainer();

      const horizontalPosition = getHorizontalPosition(event, dragOverElement),
            verticalPosition = getVerticalPosition(event, dragOverElement);

      if (this._currentDragOverElement === dragOverElement) {

        if (
          (
            draggedElement instanceof Row
            && this._currentHighlightPosition === verticalPosition
          ) || (
            draggedElement instanceof Col
            && this._currentHighlightPosition === horizontalPosition
          )
        ) {

          // nothing to update
          return;
        }

      }

      removeHighlight();

      this._currentDragOverElement = dragOverElement;

      this._currentHighlightPosition =
        (draggedElement instanceof Row)
          ? verticalPosition
          : horizontalPosition;

      if (draggedElement instanceof Row) {

        if (verticalPosition === TOP) {

          // drop above
          highlightRow(dragOverElement, container, 'top');
        } else {

          // drop below
          highlightRow(dragOverElement, container, 'bottom');
        }

      } else if (draggedElement instanceof Col) {

        const allowed = this._rules.allowed('col.move', {
          col: draggedElement,
          index: getTargetColIndex(dragOverElement, this._elementRegistry, this._sheet)
        });

        if (allowed) {
          if (horizontalPosition === LEFT) {

            // drop left
            highlightCol(dragOverElement, container, 'left');
          } else {

            // drop right
            highlightCol(dragOverElement, container, 'right');
          }
        }
      }

    });

    eventBus.on('dragAndDrop.drop', ({ draggedElement, dragOverElement, event }) => {
      this._cleanup();

      const horizontalPosition = getHorizontalPosition(event, dragOverElement),
            verticalPosition = getVerticalPosition(event, dragOverElement);

      if (draggedElement instanceof Row) {
        const rowId = dragOverElement.dataset.rowId,
              row = this._elementRegistry.get(rowId);

        if (!row
          || row === draggedElement) {
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

      } else if (draggedElement instanceof Col) {
        const allowed = this._rules.allowed('col.move', {
          col: draggedElement,
          index: getTargetColIndex(dragOverElement, this._elementRegistry, this._sheet)
        });

        if (allowed) {
          const colId = dragOverElement.dataset.colId,
                col = this._elementRegistry.get(colId);

          if (!col
            || col === draggedElement) {
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

      }
    });

    eventBus.on('dragAndDrop.dragEnd', () => {
      this._cleanup();
    });
  }

  startDrag(element, event) {
    const container = this._renderer.getContainer();

    this._dragImage = getGraphics(element, container);

    // needs to be present in DOM
    document.body.appendChild(this._dragImage);

    // QUIRK: not supported by Edge and Internet Explorer
    if (event.dataTransfer.setDragImage) {
      event.dataTransfer.setDragImage(this._dragImage, 0, 0);
    }

    this._dragAndDrop.startDrag(element, event);

    if (element instanceof Row) {
      fadeOutRow(element, container);
    } else if (element instanceof Col) {
      fadeOutCol(element, container);
    }
  }

  _cleanup() {
    const container = this._renderer.getContainer();

    removeHighlight(container);
    removeFadeOut(container);

    if (this._dragImage) {
      domRemove(this._dragImage);
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

function getTargetColIndex(dragOverElement, elementRegistry, sheet) {
  const targetCol = elementRegistry.get(dragOverElement.dataset.colId);

  if (!targetCol) {
    return false;
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

/**
 * Returns drag image for row/col
 * @param {Base} element - Row or col.
 * @param {DOMElement} container - Container to query in.
 */
function getGraphics(element, container) {
  const gfx = domify(`
      <div class="dmn-decision-table-container dragger">
        <div class="tjs-container">
          <table class="tjs-table">
            <tbody>
            </tbody>
          </table>
        </div>
      </div>
    `);

  if (element instanceof Row) {
    const cell = domQuery(`[data-row-id=${element.id}]`, container);

    const row = cell.parentNode;

    const clonedRow = row.cloneNode(true);

    gfx.style.width = row.getBoundingClientRect().width;

    forEach(row.childNodes, (childNode, index) => {

      // QUIRK: PhantomJS finds child nodes that are not actually nodes
      if (isNode(childNode)) {
        const { width, height } = childNode.getBoundingClientRect();

        clonedRow.childNodes[index].style.width = `${width}px`;
        clonedRow.childNodes[index].style.height = `${height}px`;
      }
    });

    domQuery('tbody', gfx).appendChild(clonedRow);
  } else if (element instanceof Col) {
    const cells = domQuery.all(`[data-col-id=${element.id}]`, container);

    // QUIRK: PhantomJS finds child nodes that are not actually nodes
    if (isNode(cells[0])) {
      gfx.style.width = `${cells[0].getBoundingClientRect().width}px`;
    }

    forEach(cells, cell => {

      // QUIRK: PhantomJS requires check if actual DOM node
      if (isNode(cell)) {
        const tableRow = domify('<tr></tr>');

        tableRow.appendChild(cell.cloneNode(true));

        domQuery('tbody', gfx).appendChild(tableRow);
      }
    });
  }

  return gfx;
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