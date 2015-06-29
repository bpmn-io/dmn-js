'use strict';

var inherits = require('inherits'),
    domClasses = require('min-dom/lib/classes');

var DefaultRenderer = require('table-js/lib/draw/Renderer');


function DmnRenderer(events) {

  DefaultRenderer.call(this);

  this.drawRow = function drawRow(gfx, data) {
    if(data.isHead) {
      gfx.classList.add('labels');
    } else if(data.isFoot) {
      gfx.classList.add('rules-controls');
    } else if(data.selected){
      gfx.classList.add('row-focused');
    } else {
      gfx.classList.remove('row-focused');
    }
  };

  this.drawCell = function drawCell(gfx, data) {
    if(data.selected) {
      gfx.classList.add('focused');
    } else {
      gfx.classList.remove('focused');
    }

    if(data.column.id === 'utilityColumn' && !data.row.isFoot) {
      gfx.textContent = data.content;
      gfx.classList.add(data.row.isHead ? 'hit' : 'number');
      return gfx;
    }
    if(data.row.isHead) {
      gfx.textContent = data.column.businessObject.name;
    } else if(data.content) {
      if(!data.content.tagName) {
        gfx.textContent = data.content.text;
      } else {
        gfx.classList.add('add-rule');
        gfx.appendChild(data.content);
      }
    } else {
      gfx.textContent = '';
    }
    if(!data.row.isFoot) {

      if(data.row.selected) {
        domClasses(gfx).add('row-focused');
      } else {
        domClasses(gfx).remove('row-focused');
      }
      if(data.column.selected) {
        domClasses(gfx).add('col-focused');
      } else {
        domClasses(gfx).remove('col-focused');
      }

      if(!!data.column.businessObject.inputExpression) {
        gfx.classList.add('input');
      } else {
        gfx.classList.add('output');
      }
    }
    return gfx;
  };
}

inherits(DmnRenderer, DefaultRenderer);


DmnRenderer.$inject = [ 'eventBus' ];

module.exports = DmnRenderer;
