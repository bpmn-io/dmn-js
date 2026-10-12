import DragAndDrop from 'table-js/lib/features/drag-and-drop';
import DmnDragAndDrop from './DragAndDrop';
import TableDragAndDrop from './TableDragAndDrop';
import Rules from '../rules';

export default {
  __depends__: [ DragAndDrop, Rules ],
  __init__: [ 'dmnDragAndDrop' ],
  dmnDragAndDrop: [ 'type', DmnDragAndDrop ],
  dragAndDrop: [ 'type', TableDragAndDrop ]
};