'use strict';

var inherits = require('inherits');

var DefaultRenderer = require('table-js/lib/draw/Renderer');


function DmnRenderer(events, styles, pathMap) {

  DefaultRenderer.call(this, styles);


  this.drawCell = function drawCell(gfx, data) {
    if(data.row.headerRow) {
      gfx.textContent = data.column.businessObject.name;
    } else if(data.content) {
      gfx.textContent = data.content.text;
    }
    return gfx;
  };

}

inherits(DmnRenderer, DefaultRenderer);


DmnRenderer.$inject = [ 'eventBus' ];

module.exports = DmnRenderer;
