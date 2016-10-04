'use strict';

var domClasses = require('min-dom/lib/classes');

var HIGH_PRIORITY = 1500,
    UTILITY_COL_WIDTH = 45;


function DmnRenderer(eventBus, elementRegistry, sheet, config) {

  eventBus.on('sheet.resized', HIGH_PRIORITY, function(event) {
    var context = event.context;

    var container = sheet.getContainer();

    var minColWidth = config.minColWidth;

    var baseWidth = UTILITY_COL_WIDTH,
        numberOfCols = 1,
        utilityColumn,
        firstColumn,
        minTableWidth;

    if (!context) {
      event.context = context = {};
    }

    // get a random cell to figure out the width
    utilityColumn = elementRegistry.filter(function(elem) {
      return elem.id === 'utilityColumn';
    })[0];

    firstColumn = utilityColumn.next;

    if (!firstColumn) {
      return;
    }

    // get the number of cols
    while (!firstColumn.isAnnotationsColumn) {
      firstColumn = firstColumn.next;

      numberOfCols++;
    }

    minTableWidth = baseWidth + numberOfCols * minColWidth;

    sheet.setWidth('auto');

    if (container.clientWidth <= minTableWidth) {
      context.newWidth = minTableWidth;
    }
  });

  eventBus.on('row.render', function(event) {
    if (event.data.isClauseRow) {
      domClasses(event.gfx).add('labels');
    }
  });

  eventBus.on('cell.render', function(event) {
    var data = event.data,
        gfx  = event.gfx;

    if (!data.column.businessObject) {
      return;
    }

    if (data.row.isClauseRow) {
      // clause names
      gfx.childNodes[0].textContent = data.column.businessObject.label;
    } else if (data.content) {
      if (!data.content.tagName && data.row.businessObject) {
        // input and output entries
        gfx.childNodes[0].textContent = data.content.text;
      }
    }
    if (!data.row.isFoot) {
      if (data.column.businessObject.inputExpression) {
        domClasses(gfx).add('input');
      } else {
        domClasses(gfx).add('output');
      }
    }
  });
}

DmnRenderer.$inject = [ 'eventBus', 'elementRegistry', 'sheet', 'config' ];

module.exports = DmnRenderer;
