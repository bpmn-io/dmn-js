'use strict';

var domClasses = require('min-dom/lib/classes');

function AnnotationsRenderer(
    eventBus,
    annotations) {

  eventBus.on('cell.render', function(event) {
    if (event.data.column === annotations.getColumn() && !event.data.row.isFoot) {
      domClasses(event.gfx).add('annotation');
      if (!event.data.row.isHead) {
        // render the description of the rule inside the cell
        event.gfx.childNodes[0].textContent = event.data.row.businessObject.description || '';
      }
    }
  });
}

AnnotationsRenderer.$inject = [
  'eventBus',
  'annotations'
];

module.exports = AnnotationsRenderer;
