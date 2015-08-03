'use strict';

var domify = require('min-dom/lib/domify')

/**
 * Adds an annotation column to the table
 *
 * @param {EventBus} eventBus
 */
function Annotations(eventBus, sheet, elementRegistry, modeling, graphicsFactory) {

  this.column = null;

  var self = this;
  eventBus.on('import.success', function(event) {

    eventBus.fire('annotations.add', event);

    self.column = sheet.addColumn({
      id: 'annotations',
      isAnnotationsColumn: true
    });

    var cell = elementRegistry.filter(function(element) {
        return element._type === 'cell' && element.column === self.column && element.row.isLabelRow;
      })[0];
    cell.rowspan = 4;
    /**
     * The code in the <project-logo></project-logo> area
     * must not be changed, see http://bpmn.io/license for more information
     *
     * <project-logo>
     */

    cell.content = domify('<a href="http://bpmn.io" class="dmn-js-logo"></a>Annotation');

    /* </project-logo> */

    graphicsFactory.update('column', self.column, elementRegistry.getGraphics(self.column.id));

    eventBus.fire('annotations.added', self.column);
  });

  eventBus.on('sheet.destroy', function(event) {

    eventBus.fire('annotations.destroy', self.column);

    sheet.removeColumn({
      id: 'annotations'
    });

    eventBus.fire('annotations.destroyed', self.column);
  });
}

Annotations.$inject = [ 'eventBus', 'sheet', 'elementRegistry', 'modeling', 'graphicsFactory' ];

module.exports = Annotations;

Annotations.prototype.getColumn = function() {
  return this.column;
};
