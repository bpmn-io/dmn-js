'use strict';

var assign = require('lodash/object/assign'),
    forEach = require('lodash/collection/forEach');

var domify = require('min-dom/lib/domify'),
    domQuery = require('min-dom/lib/query'),
    domClasses = require('min-dom/lib/classes');

var isNumberCell = require('./utils').isNumberCell;

var inputTemplate = require('./template-input.html');
var outputTemplate = require('./template-output.html');

var OPERATORS = [
  [ 'equals', '=' ],
  [ 'less', '<' ],
  [ 'less-equal', '<=' ],
  [ 'greater', '>' ],
  [ 'greater-equal', '>=' ]
];

var SEL_COMP_DROP = '.comparison-dropdown',
    SEL_COMP_NUM = '.comparison-number';

var SEL_START = '.include-inputs input[placeholder="start"]',
    SEL_INC_START = '.include-inputs input[placeholder="include-start"]',
    SEL_END = '.include-inputs input[placeholder="end"]',
    SEL_INC_END = '.include-inputs input[placeholder="include-end"]';

var COMPARISON_REGEXP = /^(-?(?:[0-9]|[0-9]e[0-9]|\.[0-9])+)$|^((?:<|>|=){0,2})\s*(-?(?:[0-9]|[0-9]e[0-9]|\.[0-9])+)$/,
    RANGE_REGEXP = /^(\[|\]){1}-?([0-9]|[0-9]e[0-9]|\.[0-9]){1,}\.\.-?([0-9]|[0-9]e[0-9]|\.[0-9]){1,}(\[|\]){1}$/;


function getOperator(text) {
  var operator, index;

  forEach(OPERATORS, function(option, idx) {
    index = option.indexOf(text);

    if (index === -1) {
      return;
    }

    // we want to get the opposite operator
    operator = option[ index ? 0 : 1 ];

    index = idx;

    return false;
  });

  return {
    operator: operator,
    index: index
  };
}


function NumberEdit(eventBus, simpleMode, elementRegistry, graphicsFactory, modeling, complexCell, selection) {
  this._eventBus = eventBus;
  this._simpleMode = simpleMode;
  this._elementRegistry = elementRegistry;
  this._graphicsFactory = graphicsFactory;
  this._modeling = modeling;
  this._selection = selection;
  this._complexCell = complexCell;

  eventBus.on('simpleMode.activated', this.setupComplexCells, this);
  eventBus.on('simpleMode.deactivated', this.teardownComplexCells, this);

  var refreshHandler = function() {
    if (simpleMode.isActive()) {
      this.refresh();
    }
  };
  this._eventBus.on('typeRow.editDataType', refreshHandler, this);
  this._eventBus.on('contentNode.created', refreshHandler, this);
  this._eventBus.on('element.changed', refreshHandler, this);

  // whenever an type cell is opened, we have to position the template, because the x offset changes
  // over time, when columns are added and deleted
  eventBus.on('complexCell.open', function(evt) {
    var config = evt.config;

    if (config.type === 'numberEdit') {
      var gfx = elementRegistry.getGraphics(config.element);
      var template = config.template,
          content = config.element.content,
          text = content.text;

      config.editingType = this.getEditingType(text);

      if (config.editingType === null) {
        return;
      }

      if (config.editingType === 'range') {
        this.updateRangeNode(template, text);
      } else {
        this.updateComparisonNode(template, text);
      }

      assign(template.parentNode.style, {
        left: (gfx.offsetLeft + gfx.offsetWidth - 10) + 'px'
      });

      selection.select(config.element);
    }
  }, this);

  eventBus.on('complexCell.close', function(complexCell) {
    var config = complexCell.config;
    if (config.type === 'numberEdit' && !config.isEmpty) {
      this.updateCellContent(config.element, config.template);
    }
  }, this);

  eventBus.on('cell.render', function(evt) {
    var gfx = evt.gfx,
        data = evt.data,
        content = data.content,
        editingType,
        numberGfx;

    // remove potential datafield
    numberGfx = gfx.querySelector('.number-content');

    if (numberGfx) {
      numberGfx.parentNode.removeChild(numberGfx);
    }

    if (content && isNumberCell(data)) {

      editingType = this.getEditingType(content.text);

      // add [expression] to input if it's not an editable type
      if (simpleMode.isActive() && editingType === null) {
        // // make sure the contendeditable field is hidden
        gfx.firstChild.style.display = 'none';
        evt.data.preventAutoUpdate = true;

        // check for the datafield
        numberGfx = gfx.querySelector('.number-content');

        if (!numberGfx) {
          numberGfx = domify('<span class="number-content">');

          gfx.appendChild(numberGfx);
        }

        // when the cell has a value that is not a number
        if (content.description) {
          numberGfx.innerHTML = '<span class="expression-hint"><b>[expression]</b> (<i></i>)</span>';
          numberGfx.querySelector('i').textContent = content.description;
        } else {
          numberGfx.innerHTML = '<span class="expression-hint"><b>[expression]</b></span>';
        }
      } else {
        // make sure the contenteditable field is visible
        gfx.firstChild.style.display = '';
        evt.data.preventAutoUpdate = false;
      }
    }
  }, this);
}

NumberEdit.$inject = [ 'eventBus', 'simpleMode', 'elementRegistry', 'graphicsFactory', 'modeling', 'complexCell', 'selection' ];

module.exports = NumberEdit;


NumberEdit.prototype.refresh = function() {
  this.teardownComplexCells();
  this.setupComplexCells();
};

NumberEdit.prototype.setupComplexCells = function() {
  var graphicsFactory = this._graphicsFactory,
      elementRegistry = this._elementRegistry,
      complexCell = this._complexCell;

  var self = this;

  function closeOnEnter(evt) {
    if (evt.keyCode === 13) {
      complexCell.close();
    }
  }

  elementRegistry.forEach(function(element) {
    var editingType, text, node, complexCellConfig;

    if (isNumberCell(element)) {
      text = element.content && element.content.text;

      editingType = self.getEditingType(text);

      if (editingType === null) {
        // show nothing instead
        element.complex = {
          template: domify('<div>'),
          element: element,
          type: 'numberEdit',
          isEmpty: true,
          editingType: 'comparison',
          offset: {
            x: 0,
            y: 0
          }
        };

        return graphicsFactory.update('cell', element, elementRegistry.getGraphics(element));
      }

      if (element.column.type === 'dmn:InputClause') {
        node = domify(inputTemplate);
      } else {
        node = domify(outputTemplate);
      }

      // click on Expression link switches to expression mode
      if (node.querySelector('.comparison')) {
        node.querySelector('.comparison').addEventListener('click', function() {
          domClasses(node.parentNode).remove('use-range');

          // focus the script expression input field
          if (node.querySelector(SEL_COMP_NUM)) {
            node.querySelector(SEL_COMP_NUM).focus();
            node.querySelector(SEL_COMP_NUM).select();
          }

          element.complex.editingType = 'comparison';
        });
      }

      // click on Script link switches to script mode
      if (node.querySelector('.range')) {
        node.querySelector('.range').addEventListener('click', function() {

          domClasses(node.parentNode).add('use-range');

          if (node.querySelector(SEL_START)) {
            node.querySelector(SEL_START).focus();
            node.querySelector(SEL_START).select();
          }

          element.complex.editingType = 'range';
        });
      }

      // keybindings
      // close complexCell with Enter on number input
      if (node.querySelector(SEL_COMP_NUM)) {
        node.querySelector(SEL_COMP_NUM).addEventListener('keydown', closeOnEnter);
      }

      // focus End input with Enter on Start input
      if (node.querySelector(SEL_START)) {
        node.querySelector(SEL_START).addEventListener('keydown', function(evt) {
          if (evt.keyCode === 13) {
            node.querySelector(SEL_END).focus();
            node.querySelector(SEL_END).select();
          }
        });
      }

      // close complexCell with Enter on End input
      if (node.querySelector(SEL_END)) {
        node.querySelector(SEL_END).addEventListener('keydown', closeOnEnter);
      }

      complexCellConfig = {
        className: 'dmn-number-editor',
        template: node,
        element: element,
        type: 'numberEdit',
        editingType: editingType || 'comparison'
      };

      element.complex = complexCellConfig;

      graphicsFactory.update('cell', element, elementRegistry.getGraphics(element));
    }
  });
};

/**
 * Check if it's a valid editable type, to know whether the dialog should be shown.
 *
 * @param  {String} text
 *
 * @return {String|Null}
 */
NumberEdit.prototype.getEditingType = function(text) {
  if (text === '') {
    return text;
  }

  if (COMPARISON_REGEXP.test(text)) {
    return 'comparison';
  }

  if (RANGE_REGEXP.test(text)) {
    return 'range';
  }

  return null;
};

NumberEdit.prototype.updateComparisonNode = function(template, text) {
  var numberNode = template.querySelector(SEL_COMP_NUM);
  if (!numberNode) {
    return;
  }

  var parsedText,
      dropdownIndex,
      number;

  if (text) {
    parsedText = text.match(COMPARISON_REGEXP);

    if (parsedText[1]) {
      dropdownIndex = 0;

      number = parsedText[1];
    } else {
      dropdownIndex = getOperator(parsedText[2]).index;

      number = parsedText[3];
    }

    if (template.querySelector(SEL_COMP_DROP)) {
      template.querySelector(SEL_COMP_DROP).selectedIndex = dropdownIndex;
    }

    numberNode.value = number;
  }

  domClasses(template.parentNode).remove('use-range');

  numberNode.focus();
  numberNode.select();
};

NumberEdit.prototype.parseRangeString = function(text) {
  var parsedText = text.match(/([^\[\]]*)(?:\.\.)([^\[\]]*)/);

  if (!parsedText) {
    return null;
  }
  return parsedText.splice(1);
};

NumberEdit.prototype.updateRangeNode = function(template, text) {
  var startNode = domQuery(SEL_START, template),
      isStartIncludedNode = domQuery(SEL_INC_START, template),
      endNode = domQuery(SEL_END, template),
      isEndIncludedNode = domQuery(SEL_INC_END, template),
      brackets,
      parsedNumbers;

  if (text) {
    parsedNumbers = this.parseRangeString(text);

    if (parsedNumbers && parsedNumbers.length === 2) {
      brackets = text.match(/\[|\]/g);

      startNode.value = parsedNumbers[0];
      isStartIncludedNode.checked = brackets[0] === '[';

      endNode.value = parsedNumbers[1];
      isEndIncludedNode.checked = brackets[1] === ']';
    }
  }

  domClasses(template.parentNode).add('use-range');

  template.querySelector(SEL_START).focus();
  template.querySelector(SEL_START).select();
};

NumberEdit.prototype.updateCellContent = function(element, node) {
  var modeling = this._modeling;

  if (!element.complex) {
    return;
  }

  var editingType = element.complex.editingType,
      content;

  if (editingType === 'range') {
    content = this.parseRange(node);
  } else {
    content = this.parseComparison(node);
  }

  modeling.editCell(element.row.id, element.column.id, content);
};

NumberEdit.prototype.parseComparison = function(node) {
  var dropdown = domQuery(SEL_COMP_DROP, node),
      numberNode = domQuery(SEL_COMP_NUM, node),
      numberValue = numberNode.value,
      operator;

  if (!dropdown) {
    return numberValue;
  }

  var dropdownValue = dropdown.children[dropdown.selectedIndex].value;

  if (!numberValue) {
    return '';
  }

  operator = getOperator(dropdownValue).operator;

  // don't show the equal operator
  operator = operator === '=' ? '' : operator + ' ';

  return operator + numberValue;
};

NumberEdit.prototype.parseRange = function(node) {
  var start = domQuery(SEL_START, node).value,
      isStartIncluded = domQuery(SEL_INC_START, node).checked,
      end = domQuery(SEL_END, node).value,
      isEndIncluded = domQuery(SEL_INC_END, node).checked;

  var startBracket = isStartIncluded ? '[' : ']',
      endBracket = isEndIncluded ? ']' : '[';

  if (!start || !end) {
    return '';
  }

  return startBracket + start + '..' + end + endBracket;
};

NumberEdit.prototype.teardownComplexCells = function() {
  var graphicsFactory = this._graphicsFactory,
      elementRegistry = this._elementRegistry;

  elementRegistry.forEach(function(element) {
    if (element.complex && element.complex.type === 'numberEdit') {

      delete element.complex;

      graphicsFactory.update('cell', element, elementRegistry.getGraphics(element));
    }
  });
};
