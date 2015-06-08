'use strict';

function selectAll(selector, ctx) {
  return Array.prototype.slice.apply((ctx || document).querySelectorAll(selector) || []);
}

function cellTable(cell) {
  for (var node = cell.parentNode; node.tagName.toLowerCase() !== 'table'; node = node.parentNode) {}
  return node;
}

function removeHoverClass(el) {
  el.classList.remove('hover');
}
function addHoverClass(el) {
  el.classList.add('hover');
}

function tableColumnHover(evt) {
  var colNum = selectAll('td', evt.target.parentNode).indexOf(evt.target);
  var rows = selectAll('tbody tr', cellTable(evt.target));
  rows.forEach(function (row) {
    var tds = selectAll('td', row);
    tds.forEach(removeHoverClass);
    addHoverClass(tds[colNum]);
  });
}

function elStyle(el) {
  return el.currentStyle || window.getComputedStyle(el);
}

function int(v) {
  return parseInt(v, 10);
}

function elBox(el, withMargin, withoutBorder) {
  var style = elStyle(el);

  return {
    top:    int(style.paddingTop) +
            (withMargin ? int(style.marginTop) : 0) +
            (withoutBorder ? 0 : int(style.borderTopWidth)),

    right:  int(style.paddingRight) +
            (withMargin ? int(style.marginRight) : 0) +
            (withoutBorder ? 0 : int(style.borderRightWidth)),

    bottom: int(style.paddingBottom) +
            (withMargin ? int(style.marginBottom) : 0) +
            (withoutBorder ? 0 : int(style.borderBottomWidth)),

    left:   int(style.paddingLeft) +
            (withMargin ? int(style.marginLeft) : 0) +
            (withoutBorder ? 0 : int(style.borderLeftWidth))
  };
}

function children(parent) {
  return Array.prototype.slice.apply(parent.childNodes)
          .filter(function (el) {
            return !!el.tagName;
          });
}


function cellFocus(evt) {
  console.info('cellFocus', evt.target, evt.target.innerText);
}


function cellBlur(evt) {
  console.info('cellBlur', evt.target, evt.target.innerText);
}


function cellInput(evt) {
  console.info('cellInput', evt.target, evt.target.innerText);
}



function DecisionTable(el, options) {
  if (!el) {
    throw new Error('Missing element to construct a DecisionTable');
  }
  options = options || {};
  this.el = el;
  this.inputs = [];
  this.outputs = [];

  var parent = this.el.parentNode;
  var parentBox = elBox(parent);
  var parentHeight = parent.clientHeight - (parentBox.top + parentBox.bottom);

  this.table = selectAll('table', this.el)[0];
  this.body = selectAll('tbody', this.table)[0];

  if (this.el.clientHeight > parentHeight) {
    var fullHeight = parentHeight;
    var div = document.createElement('div');

    this.table.classList.add('detached', 'dmn-table-head');
    this.table.removeChild(this.body);

    this.bodyTable = document.createElement('table');
    this.bodyTable.classList.add('detached', 'dmn-table-body');
    this.bodyTable.appendChild(this.body);

    div.classList.add('body-wrapper');
    this.el.classList.add('scrollable');
    this.el.style.height = fullHeight +'px';

    children(parent).forEach(function (child) {
      if (child === el) { return; }
      fullHeight -= (child.clientHeight + child.offsetTop);
    });

    div.style.height = (fullHeight - (this.table.clientHeight + this.table.offsetTop + 1)) +'px';
    div.appendChild(this.bodyTable);

    this.el.appendChild(div);
  }


  selectAll([
    '.labels td',
    '.values td',
    '.mappings td',
    'tbody .input',
    'tbody .output',
    'tbody .annotation'
  ].join(', '), this.el).forEach(function (cell) {
    cell.contentEditable = true;
    cell.addEventListener('focus', cellFocus);
    cell.addEventListener('blur', cellBlur);
    cell.addEventListener('input', cellInput);
  });

  selectAll('tbody .input, tbody .output', this.el).forEach(function (col) {
    col.addEventListener('mouseover', tableColumnHover);
  });
}

DecisionTable.prototype.columnNumber = function (cell) {
  return selectAll('td', this.el).indexOf(cell);
};

DecisionTable.prototype.addInput = function () {

};


DecisionTable.prototype.addOutput = function () {

};


DecisionTable.prototype.addRow = function () {

};


DecisionTable.prototype.toggleEditing = function () {

};





function DecisionTableInput(table) {
  if (!table) { throw new Error('Missing table argument for DecisionTableInput'); }
  this.table = table;
}

DecisionTableInput.prototype.label = function (value) {
  if (!value) { return this.labelEl.innerText.trim(); }
  this.labelEl.innerText = value;
  return this;
};


DecisionTableInput.prototype.choices = function (value) {
  if (!value) { return this.choicesEl.innerText.trim(); }
  this.choicesEl.innerText = value;
  return this;
};


DecisionTableInput.prototype.mapping = function (value) {
  if (!value) { return this.mappingEl.innerText.trim(); }
  this.mappingEl.innerText = value;
  return this;
};


DecisionTableInput.prototype.remove = function () {
  // this.table =
};





function DecisionTableOutput(table) {
  if (!table) { throw new Error('Missing table argument for DecisionTableOutput'); }
  this.table = table;
}

DecisionTableOutput.prototype.label = function (value) {
  if (!value) { return this.labelEl.innerText.trim(); }
  this.labelEl.innerText = value;
  return this;
};


DecisionTableOutput.prototype.choices = function (value) {
  if (!value) { return this.choicesEl.innerText.trim(); }
  this.choicesEl.innerText = value;
  return this;
};


DecisionTableOutput.prototype.mapping = function (value) {
  if (!value) { return this.mappingEl.innerText.trim(); }
  this.mappingEl.innerText = value;
  return this;
};


DecisionTableOutput.prototype.remove = function () {};




var dialogElement = document.createElement('div');
dialogElement.classList.add('dmn-modal');
function DecisionTableDialog() {
  if (document.body.contains(dialogElement)) {
    return;
  }

  document.body.appendChild(dialogElement);
}

DecisionTableDialog.prototype.open = function () {
  document.body.classList.add('dmn-modal-open');
};

DecisionTableDialog.prototype.close = function () {
  document.body.classList.remove('dmn-modal-open');
};
