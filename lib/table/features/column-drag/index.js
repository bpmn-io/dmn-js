module.exports = {
  __init__: [ 'columnDrag', 'columnDragRenderer' ],
  columnDrag: [ 'type', require('./ColumnDrag') ],
  columnDragRenderer: [ 'type', require('./DragRenderer') ]
};
