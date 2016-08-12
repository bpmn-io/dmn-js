'use strict';

var domify = require('min-dom/lib/domify');

/**
 * Adds an annotation column to the table
 *
 * @param {EventBus} eventBus
 */
function Annotations(eventBus, sheet, elementRegistry, graphicsFactory) {

  this.column = null;

  var labelCell;

  eventBus.on('import.done', function(event) {
    var column;

    if (event.error) {
      return;
    }

    eventBus.fire('annotations.add', event);

    this.column = column = sheet.addColumn({
      id: 'annotations',
      isAnnotationsColumn: true
    });

    labelCell = elementRegistry.filter(function(element) {
      return element._type === 'cell' && element.column === column && element.row.isLabelRow;
    })[0];

    labelCell.rowspan = 4;

    labelCell.content = domify('Annotation');

    graphicsFactory.update('column', column, elementRegistry.getGraphics(this.column.id));

    eventBus.fire('annotations.added', column);
  }, this);

  eventBus.on([ 'sheet.destroy', 'sheet.clear' ], function(event) {
    var column = this.column;

    eventBus.fire('annotations.destroy', column);

    sheet.removeColumn({
      id: 'annotations'
    });

    eventBus.fire('annotations.destroyed', column);
  }, this);
}

Annotations.$inject = [ 'eventBus', 'sheet', 'elementRegistry', 'graphicsFactory' ];

module.exports = Annotations;

Annotations.prototype.getColumn = function() {
  return this.column;
};
