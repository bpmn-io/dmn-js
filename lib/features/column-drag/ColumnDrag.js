'use strict';

var domify = require('min-dom/lib/domify');
var domClasses = require('min-dom/lib/classes');

var DRAG_THRESHOLD = 10;

function ColumnDrag(eventBus, sheet, elementRegistry, modeling) {

  this._sheet = sheet;
  this._elementRegistry = elementRegistry;
  this._utilityColumn = null;
  this._modeling = modeling;

  var self = this;

  eventBus.on('utilityColumn.added', function(event) {
    var column = event.column;
    self._utilityColumn = column;
  });

  this.dragDistance = 0;
  this.draggedElement = null;
  this.previousCoordinates = {
    x: 0,
    y: 0
  };
  this.highlightedBorder = null;
  this.moveLeft = false;

  eventBus.on('element.mousedown', function(event) {
    if(event.originalEvent.target.getAttribute('class') === 'drag-handle') {
      event.preventDefault();
      self.startDragging(event.element);
      self.setLastDragPoint(event.originalEvent);
    }
  });
  document.body.addEventListener('mouseup', function(event) {
    if(self.isDragging()) {
      self.stopDragging();
    }
  });
  document.body.addEventListener('mousemove', function(event) {
    if(self.isDragging()) {
      event.preventDefault();
      self.updateDragDistance(event);
      if(self.dragDistance > DRAG_THRESHOLD) {
        self.updateVisuals(event);
      }
    }
  });
}

ColumnDrag.$inject = [ 'eventBus', 'sheet', 'elementRegistry', 'modeling' ];

module.exports = ColumnDrag;

ColumnDrag.prototype.setLastDragPoint = function(event) {
  this.previousCoordinates.x = event.clientX;
  this.previousCoordinates.y = event.clientY;
};

ColumnDrag.prototype.updateVisuals = function(event) {

  if(!this.dragVisual) {
    this.dragVisual = this.createDragVisual(this.draggedElement);
  }

  var container = this._sheet.getContainer();
  container.appendChild(this.dragVisual);

  this.dragVisual.style.position = 'fixed';
  this.dragVisual.style.left = (this.previousCoordinates.x + 5) + 'px';
  this.dragVisual.style.top = (this.previousCoordinates.y + 5) + 'px';

  // clear the indicator for the previous run
  if(this.highlightedBorder) {
    domClasses(this.highlightedBorder).remove('drop');
    domClasses(this.highlightedBorder).remove('left');
    domClasses(this.highlightedBorder).remove('right');
    this.highlightedBorder = null;
  }

  // get the element we are hovering over
  var td = event.target;
  while(td && (td.tagName || '').toLowerCase() !== 'td') {
    td = td.parentNode;
  }
  if(td) {
    // check if we hover over the top or the bottom half of the row
      var e = td;
      var offset = {x:0,y:0};
      while (e)
      {
          offset.x += e.offsetLeft;
          offset.y += e.offsetTop;
          e = e.offsetParent;
      }
      if(event.clientX < offset.x + td.clientWidth / 2) {
        domClasses(td).add('drop');
        domClasses(td).add('left');
        this.moveLeft = true;
      } else {
        domClasses(td).add('drop');
        domClasses(td).add('right');
        this.moveLeft = false;
      }

    this.highlightedBorder = td;
  }
};

ColumnDrag.prototype.updateDragDistance = function(event) {
  this.dragDistance +=
      Math.abs(event.clientX - this.previousCoordinates.x) +
      Math.abs(event.clientY - this.previousCoordinates.y);

  this.setLastDragPoint(event);
};

ColumnDrag.prototype.startDragging = function(element) {
  this.draggedElement = element;
  this.dragDistance = 0;

  this.dragVisual = null;
};

ColumnDrag.prototype.createDragVisual = function(element) {
  // get the html element of the dragged element
  var gfx = this._elementRegistry.getGraphics(element);

  // get the index of the element
  var idx = [].indexOf.call(gfx.parentNode.childNodes, gfx); // childNodes is a NodeList and not an array :(

  var table = domify('<table>');

  // iterate over the rest of the head
  var thead = domify('<thead>');
  var node = gfx.parentNode;
  do {
    // clone row
    var rowClone = node.cloneNode(true);

    // clone cell with correct idx
    var cellClone = rowClone.childNodes.item(idx).cloneNode(true);

    cellClone.style.height = rowClone.childNodes.item(idx).clientHeight + 'px';

    // remove all childNodes from the rowClone
    while(rowClone.firstChild) {
      rowClone.removeChild(rowClone.firstChild);
    }

    // add the cellclone as only child of the row
    rowClone.appendChild(cellClone);
    thead.appendChild(rowClone);
  } while (node = node.nextSibling);
  table.appendChild(thead);

  // iterate over the body
  var tbody = domify('<tbody>');
  var node = this._sheet.getBody().firstChild;
  do {
    // clone row
    var rowClone = node.cloneNode(true);

    // clone cell with correct idx
    var cellClone = rowClone.childNodes.item(idx).cloneNode(true);

    cellClone.style.height = node.childNodes.item(idx).clientHeight + 'px';

    // remove all childNodes from the rowClone
    while(rowClone.firstChild) {
      rowClone.removeChild(rowClone.firstChild);
    }

    // add the cellclone as only child of the row
    rowClone.appendChild(cellClone);
    tbody.appendChild(rowClone);
  } while (node = node.nextSibling);
  table.appendChild(tbody);


  // put it in a table tbody
  table.setAttribute('class','dragTable');
  table.style.width = gfx.clientWidth + 'px';

  // fade the original element
  domClasses(gfx).add('dragged');
  return table;
};

ColumnDrag.prototype.stopDragging = function() {
  if(this.highlightedBorder) {
    // make sure we drop it to the element we have previously highlighted
    var targetElement = this._elementRegistry.get(this.highlightedBorder.getAttribute('data-element-id'));
    this._modeling.moveColumn(this.draggedElement.column, targetElement.column, this.moveLeft);
  }
  if(this.dragVisual) {
    this.dragVisual.parentNode.removeChild(this.dragVisual);
    // restore opacity of the element
    domClasses(this._elementRegistry.getGraphics(this.draggedElement)).remove('dragged');
    this._elementRegistry.getGraphics(this.draggedElement).style.opacity = '';
  }
  if(this.highlightedBorder) {
    domClasses(this.highlightedBorder).remove('drop');
    domClasses(this.highlightedBorder).remove('left');
    domClasses(this.highlightedBorder).remove('right');
    this.highlightedBorder = null;
  }

  this.draggedElement = null;
};

ColumnDrag.prototype.isDragging = function() {
  return !!this.draggedElement;
};
