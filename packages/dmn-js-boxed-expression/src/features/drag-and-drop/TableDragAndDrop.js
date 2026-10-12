import BaseDragAndDrop from 'table-js/lib/features/drag-and-drop/DragAndDrop';

import { Row, Col } from 'table-js/lib/model';

/**
 * Drag and drop of rows and cols within the table they belong to.
 *
 * The base implementation moves the dragged element within the primary
 * root only.
 */
export default class TableDragAndDrop extends BaseDragAndDrop {

  handleDrop = (event) => {

    // prevent default drop action
    // QUIRK: Firefox will redirect if not prevented
    event.stopPropagation();
    event.preventDefault();

    const target = this._emit('dragAndDrop.drop', event);

    if (target) {
      const { draggedElement } = this._dragContext;

      if (draggedElement instanceof Row) {
        this._modeling.moveRow(draggedElement, draggedElement.root.rows.indexOf(target));
      } else if (draggedElement instanceof Col) {
        this._modeling.moveCol(draggedElement, draggedElement.root.cols.indexOf(target));
      }
    }

    // manually call drag end, as we prevent the default browser behavior
    this.handleDragEnd(event);
  };

}

TableDragAndDrop.$inject = [
  'eventBus',
  'renderer',
  'modeling',
  'sheet'
];
