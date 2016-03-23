module.exports = {
  __init__: [ 'columnDrag', 'columnDragRenderer' ],
  __depends__: [],
  columnDrag: [ 'type', require('./ColumnDrag') ],
  columnDragRenderer: [ 'type', require('./DragRenderer') ]
};
