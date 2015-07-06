'use strict';

var inherits = require('inherits'),
    domClasses = require('min-dom/lib/classes'),
    forEach = require('lodash/collection/forEach'),
    distance = function distance(from, to) {
      var i = 0,
          current = from.column;
      while(current && current !== to.column) {
        current = current.next;
        i++;
      }
      return !current ? -1 : i;
    };

var DefaultRenderer = require('table-js/lib/draw/Renderer');


function DmnRenderer(events, elementRegistry) {

  DefaultRenderer.call(this, elementRegistry);

  this.drawRow = function drawRow(gfx, data) {
    if(data.isClauseRow) {
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
    gfx.childNodes[0].setAttribute('spellcheck', 'false');

    // colspan attribute
    if(data.colspan) {
      gfx.setAttribute('colspan', data.colspan);
    }

    // traverse backwards to find colspanned elements which might overlap us
    var cells = this._elementRegistry.filter(function(element) {
      return element._type === 'cell' && element.row === data.row;
    });

    gfx.style.display = '';
    forEach(cells, function(cell) {
      var d = distance(cell, data);
      if(cell.colspan && d > 0 && d < cell.colspan) {
        gfx.style.display = 'none';
      }
    });
    if(data.selected) {
      gfx.classList.add('focused');
    } else {
      gfx.classList.remove('focused');
    }

    if(data.column.id === 'utilityColumn' && !data.row.isFoot) {
      gfx.childNodes[0].textContent = data.content;
      gfx.classList.add(data.row.isHead ? 'hit' : 'number');
      return gfx;
    }
    if(data.row.isClauseRow) {
      gfx.childNodes[0].textContent = data.column.businessObject.name;
    } else if(data.row.isLabelRow) {
      if(data.content && !gfx.childNodes[0].firstChild) {
        gfx.childNodes[0].appendChild(data.content);
      }
    } else if(data.content) {
      if(!data.content.tagName) {
        gfx.childNodes[0].textContent = data.content.text;
      } else {
        gfx.classList.add('add-rule');
        gfx.childNodes[0].appendChild(data.content);
      }
    } else {
      gfx.childNodes[0].textContent = '';
    }
    if(!data.row.isFoot) {

      if(data.row.selected) {
        domClasses(gfx).add('row-focused');
      } else {
        domClasses(gfx).remove('row-focused');
      }
      if(data.column.selected && !data.row.isLabelRow) {
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


DmnRenderer.$inject = [ 'eventBus', 'elementRegistry' ];

module.exports = DmnRenderer;
