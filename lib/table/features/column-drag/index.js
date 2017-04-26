module.exports = {
  __init__: [ 'columnDrag', 'columnDragRenderer' ],
  __depends__: [
    require('diagram-js/lib/i18n/translate')
  ],
  columnDrag: [ 'type', require('./ColumnDrag') ],
  columnDragRenderer: [ 'type', require('./DragRenderer') ]
};
