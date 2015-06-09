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
  if (!el || !el.classList) { return; }
  el.classList.add('hover');
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



function DropDownCell(el, choices) {
  this.el = el;
  this.el.classList.add('dropdown');
  this.choices = choices;
  this.render();
}

DropDownCell.prototype.render = function () {
  var cell = this.el;
  var wrapper = document.createElement('div');
  wrapper.classList.add('wrapper');
  
  var val = document.createElement('span');
  val.innerText = this.el.innerText;
  val.classList.add('value');
  val.addEventListener('click', function (evt) {
    cell.classList.toggle('open');
  });

  var clear = this.clear = document.createElement('a');
  clear.classList.add('clear', 'icon-dmn');
  clear.addEventListener('click', function () {
    val.innerHTML = '';
  });
  wrapper.appendChild(clear);

  wrapper.appendChild(val);

  var caret = this.caret = document.createElement('a');
  caret.classList.add('caret', 'icon-dmn');
  caret.addEventListener('click', function () {
    cell.classList.toggle('open');
  });
  wrapper.appendChild(caret);
  
  this.el.innerHTML = '';
  this.el.appendChild(wrapper);
  
  function makeChoice(label, clear) {
    var a = document.createElement('a');
    a.innerText = label;
    a.addEventListener('click', function (evt) {
      val.innerText = clear !== true ? a.innerText : '';
      cell.classList.remove('open');
      evt.preventDefault();
    });
    
    var choice = document.createElement('li');
    choice.appendChild(a);
    if (clear === true) {
      choice.classList.add('clear');
    }

    list.appendChild(choice);
  }

  var list = this.list = document.createElement('ul');
  this.choices.forEach(makeChoice, this);
  // makeChoice('clear', true);

  this.el.appendChild(list);
  return this;
};

DropDownCell.prototype.close = function () {};

DropDownCell.prototype.value = function () {};






function DecisionTable(el, options) {
  if (!el) {
    throw new Error('Missing element to construct a DecisionTable');
  }
  options = options || {};
  this.el = el;
  this.inputs = [];
  this.outputs = [];

  this.table = selectAll('table', this.el)[0];
  this.body = selectAll('tbody', this.table)[0];

  var index = 2;
  if (this.el.querySelector('thead .control')) {
    index = 3;
  }

  selectAll('thead tr.labels td.input', this.el).forEach(function (labelCell, delta) {
    var label = labelCell.innerText.trim();
    var dataType;
    var choicesCell = this.el.querySelector('thead tr.values td:nth-child(' + (delta + 1) + ')');
    var choices = choicesCell.innerText.trim();

    // list of choices
    if (choices[0] === '(' && choices.slice(-1) === ')') {
      choices = choices
        .slice(1, -1)
        .split(',')
        .map(function (str) {
          return str.trim();
        })
        .filter(function (str) {
          return !!str;
        })
        ;
    }
    // data type
    else if (choices) {
      dataType = choices;
      choices = [];
    }



    var mappingsCell = this.el.querySelector('thead tr.mappings td:nth-child(' + (delta + 1) + ')');
    var mappings = mappingsCell.innerText.trim();

    var cellEls = selectAll('tbody tr td:nth-child(' + (delta + index) + ')', this.body);
    var cells = cellEls.map(function (cell) {
      return cell.innerText.trim();
    });


    if (choices.length < 2) {
      cellEls.forEach(function (cell) {
        cell.contentEditable = true;
        cell.addEventListener('input', this.cellInput.bind(this));
      }, this);
    }

    else {
      cellEls.forEach(function (cell) {
        new DropDownCell(cell, choices);
      }, this);
    }
  }, this);

  this
    .splitBody()
    .bindEvents();
}



DecisionTable.prototype.splitBody = function () {
  var parent = this.el.parentNode;
  var parentBox = elBox(parent);
  var parentHeight = parent.clientHeight - (parentBox.top + parentBox.bottom);

  if (this.el.clientHeight <= parentHeight) {
    return this;
  }

  var el = this.el;
  var fullHeight = parentHeight;
  var div = document.createElement('div');

  this.table.classList.add('detached', 'dmn-table-head');
  this.table.removeChild(this.body);

  this.bodyTable = document.createElement('table');
  this.bodyTable.classList.add('detached', 'dmn-table-body');
  this.bodyTable.appendChild(this.body);

  div.classList.add('body-wrapper');
  el.classList.add('scrollable');
  el.style.height = fullHeight +'px';

  children(parent).forEach(function (child) {
    if (child === el) { return; }
    fullHeight -= (child.clientHeight + child.offsetTop);
  });

  div.style.height = (fullHeight - (this.table.clientHeight + this.table.offsetTop + 1)) +'px';
  div.appendChild(this.bodyTable);

  el.appendChild(div);

  return this;
};



DecisionTable.prototype.bindEvents = function () {
  selectAll([
    '.labels td',
    '.values td',
    '.mappings td',
    'tbody .input',
    'tbody .output',
    'tbody .annotation'
  ].join(', '), this.el).forEach(function (cell) {
    cell.addEventListener('focus', this.cellFocus.bind(this));
    cell.addEventListener('blur', this.cellBlur.bind(this));
  }, this);

  selectAll('tbody .input, tbody .output', this.el).forEach(function (col) {
    col.addEventListener('mouseover', this.tableColumnHover.bind(this));
  }, this);

  return this;
};


DecisionTable.prototype.tableColumnHover = function(evt) {
  var colNum = selectAll('td', evt.target.parentNode).indexOf(evt.target);
  var rows = selectAll('tbody tr', cellTable(evt.target));
  rows.forEach(function (row) {
    var tds = selectAll('td', row);
    tds.forEach(removeHoverClass);
    addHoverClass(tds[colNum]);
  });
};


DecisionTable.prototype.cellFocus = function (evt) {
  console.info('cellFocus', evt.target, evt.target.innerText);
};


DecisionTable.prototype.cellBlur = function (evt) {
  console.info('cellBlur', evt.target, evt.target.innerText);
};


DecisionTable.prototype.cellInput = function (evt) {
  console.info('cellInput', evt.target, evt.target.innerText);
};






































/* 
 * classList.js: Cross-browser full element.classList implementation.
 * 2014-07-23
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

if ("document" in self) {

// Full polyfill for browsers with no classList support
if (!("classList" in document.createElement("_"))) {

(function (view) {

"use strict";

if (!('Element' in view)) return;

var
	  classListProp = "classList"
	, protoProp = "prototype"
	, elemCtrProto = view.Element[protoProp]
	, objCtr = Object
	, strTrim = String[protoProp].trim || function () {
		return this.replace(/^\s+|\s+$/g, "");
	}
	, arrIndexOf = Array[protoProp].indexOf || function (item) {
		var
			  i = 0
			, len = this.length
		;
		for (; i < len; i++) {
			if (i in this && this[i] === item) {
				return i;
			}
		}
		return -1;
	}
	// Vendors: please allow content code to instantiate DOMExceptions
	, DOMEx = function (type, message) {
		this.name = type;
		this.code = DOMException[type];
		this.message = message;
	}
	, checkTokenAndGetIndex = function (classList, token) {
		if (token === "") {
			throw new DOMEx(
				  "SYNTAX_ERR"
				, "An invalid or illegal string was specified"
			);
		}
		if (/\s/.test(token)) {
			throw new DOMEx(
				  "INVALID_CHARACTER_ERR"
				, "String contains an invalid character"
			);
		}
		return arrIndexOf.call(classList, token);
	}
	, ClassList = function (elem) {
		var
			  trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
			, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
			, i = 0
			, len = classes.length
		;
		for (; i < len; i++) {
			this.push(classes[i]);
		}
		this._updateClassName = function () {
			elem.setAttribute("class", this.toString());
		};
	}
	, classListProto = ClassList[protoProp] = []
	, classListGetter = function () {
		return new ClassList(this);
	}
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
	return this[i] || null;
};
classListProto.contains = function (token) {
	token += "";
	return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
	;
	do {
		token = tokens[i] + "";
		if (checkTokenAndGetIndex(this, token) === -1) {
			this.push(token);
			updated = true;
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.remove = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
		, index
	;
	do {
		token = tokens[i] + "";
		index = checkTokenAndGetIndex(this, token);
		while (index !== -1) {
			this.splice(index, 1);
			updated = true;
			index = checkTokenAndGetIndex(this, token);
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.toggle = function (token, force) {
	token += "";

	var
		  result = this.contains(token)
		, method = result ?
			force !== true && "remove"
		:
			force !== false && "add"
	;

	if (method) {
		this[method](token);
	}

	if (force === true || force === false) {
		return force;
	} else {
		return !result;
	}
};
classListProto.toString = function () {
	return this.join(" ");
};

if (objCtr.defineProperty) {
	var classListPropDesc = {
		  get: classListGetter
		, enumerable: true
		, configurable: true
	};
	try {
		objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	} catch (ex) { // IE 8 doesn't support enumerable:true
		if (ex.number === -0x7FF5EC54) {
			classListPropDesc.enumerable = false;
			objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
		}
	}
} else if (objCtr[protoProp].__defineGetter__) {
	elemCtrProto.__defineGetter__(classListProp, classListGetter);
}

}(self));

} else {
// There is full or partial native classList support, so just check if we need
// to normalize the add/remove and toggle APIs.

(function () {
	"use strict";

	var testElement = document.createElement("_");

	testElement.classList.add("c1", "c2");

	// Polyfill for IE 10/11 and Firefox <26, where classList.add and
	// classList.remove exist but support only one argument at a time.
	if (!testElement.classList.contains("c2")) {
		var createMethod = function(method) {
			var original = DOMTokenList.prototype[method];

			DOMTokenList.prototype[method] = function(token) {
				var i, len = arguments.length;

				for (i = 0; i < len; i++) {
					token = arguments[i];
					original.call(this, token);
				}
			};
		};
		createMethod('add');
		createMethod('remove');
	}

	testElement.classList.toggle("c3", false);

	// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
	// support the second argument.
	if (testElement.classList.contains("c3")) {
		var _toggle = DOMTokenList.prototype.toggle;

		DOMTokenList.prototype.toggle = function(token, force) {
			if (1 in arguments && !this.contains(token) === !force) {
				return force;
			} else {
				return _toggle.call(this, token);
			}
		};

	}

	testElement = null;
}());

}

}