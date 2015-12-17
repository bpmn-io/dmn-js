'use strict';

var domClasses = require('min-dom/lib/classes');
var domify = require('min-dom/lib/domify');

function DragRenderer(
    eventBus,
    utilityColumn) {

  eventBus.on('cell.render', function(event) {
    if (event.data.row.isClauseRow) {
      domClasses(event.gfx).add('draggable');
      if(event.gfx.lastChild.getAttribute('class') !== 'drag-handle') {
        event.gfx.appendChild(domify('<span class="drag-handle"></span>'));
      }
    }
  });
}

DragRenderer.$inject = [
  'eventBus',
  'utilityColumn'
];

module.exports = DragRenderer;
