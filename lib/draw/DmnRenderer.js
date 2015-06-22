'use strict';

var inherits = require('inherits');

var DefaultRenderer = require('table-js/lib/draw/Renderer');


function DmnRenderer(events, styles, pathMap) {

  DefaultRenderer.call(this, styles);

  this.drawRow = function drawRow(gfx, data) {
    if(data.isHead) {
      gfx.className = 'labels';
    } else if(data.isFoot) {
      gfx.className = 'rules-controls';
    }
  };

  this.drawCell = function drawCell(gfx, data) {
    if(data.row.isHead) {
      gfx.textContent = data.column.businessObject.name;
    } else if(data.content) {
      if(!data.content.tagName) {
        gfx.textContent = data.content.text;
      } else {
        gfx.className = 'add-rule';
        gfx.appendChild(data.content);
      }
    }
    if(!data.row.isFoot) {
      if(!!data.column.businessObject.inputExpression) {
        gfx.className = 'input';
      } else {
        gfx.className = 'output';
      }
    }
    return gfx;
  };
}

inherits(DmnRenderer, DefaultRenderer);


DmnRenderer.$inject = [ 'eventBus' ];

module.exports = DmnRenderer;
