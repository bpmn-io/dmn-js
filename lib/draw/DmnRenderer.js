'use strict';

var domClasses = require('min-dom/lib/classes');

function DmnRenderer(eventBus) {

  eventBus.on('row.render', function(event) {
    if(event.data.isClauseRow) {
      domClasses(event.gfx).add('labels');
    }
  });

  eventBus.on('cell.render', function(event) {
    var data = event.data,
        gfx  = event.gfx;

    if(!data.column.businessObject) {
      return;
    }

    if(data.row.isClauseRow) {
      // clause names
      gfx.childNodes[0].textContent = data.column.businessObject.label;
    } else if(data.content) {
      if(!data.content.tagName && data.row.businessObject) {
        // input and output entries
        gfx.childNodes[0].textContent = data.content.text;
      }
    }
    if(!data.row.isFoot) {
      if(!!data.column.businessObject.inputExpression) {
        domClasses(gfx).add('input');
      } else {
        domClasses(gfx).add('output');
      }
    }
  });
}

DmnRenderer.$inject = [ 'eventBus' ];

module.exports = DmnRenderer;
