'use strict';

var domClasses = require('min-dom/lib/classes');
var domify = require('min-dom/lib/domify');

function DragRenderer(
    eventBus,
    utilityColumn) {

  eventBus.on('cell.render', function(event) {
    if (event.data.row.isClauseRow) {
      domClasses(event.gfx).add('draggable');

      var hasDragHandle = domClasses(event.gfx.lastChild).has('drag-handle');

      if (!hasDragHandle) {
        event.gfx.appendChild(domify('<span class="drag-handle dmn-icon-drag"></span>'));
      }
    }

    // add drag icon for rows
    if (event.data.column === utilityColumn.getColumn() && !event.data.row.isFoot && !event.data.row.isHead) {
      domClasses(event.gfx).add('dmn-icon-drag');
    }
  });
}

DragRenderer.$inject = [
  'eventBus',
  'utilityColumn'
];

module.exports = DragRenderer;
