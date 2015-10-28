'use strict';

var domify = require('min-dom/lib/domify');

/**
 * Adds an annotation column to the table
 *
 * @param {EventBus} eventBus
 */
function Annotations(eventBus, sheet, elementRegistry, graphicsFactory, hideTechControl) {

  this.column = null;

  var self = this;

  var labelCell;

  eventBus.on('import.success', function(event) {

    eventBus.fire('annotations.add', event);

    self.column = sheet.addColumn({
      id: 'annotations',
      isAnnotationsColumn: true
    });

    labelCell = elementRegistry.filter(function(element) {
        return element._type === 'cell' && element.column === self.column && element.row.isLabelRow;
      })[0];
    labelCell.rowspan = hideTechControl.isHidden() ? 2 : 4;
    /**
     * The code in the <project-logo></project-logo> area
     * must not be changed, see http://bpmn.io/license for more information
     *
     * <project-logo>
     */

    labelCell.content = domify('<a href="http://bpmn.io" class="dmn-js-logo"></a>Annotation');

    /* </project-logo> */

    graphicsFactory.update('column', self.column, elementRegistry.getGraphics(self.column.id));

    eventBus.fire('annotations.added', self.column);
  });

  eventBus.on('details.hidden', function() {
    if(labelCell) {
      labelCell.rowspan = 2;
      graphicsFactory.update('column', self.column, elementRegistry.getGraphics(self.column.id));
    }
  });
  eventBus.on('details.shown', function() {
    if(labelCell) {
      labelCell.rowspan = 4;
      graphicsFactory.update('column', self.column, elementRegistry.getGraphics(self.column.id));
    }
  });

  eventBus.on('sheet.destroy', function(event) {

    eventBus.fire('annotations.destroy', self.column);

    sheet.removeColumn({
      id: 'annotations'
    });

    eventBus.fire('annotations.destroyed', self.column);
  });
}

Annotations.$inject = [ 'eventBus', 'sheet', 'elementRegistry', 'graphicsFactory', 'hideTechControl' ];

module.exports = Annotations;

Annotations.prototype.getColumn = function() {
  return this.column;
};
