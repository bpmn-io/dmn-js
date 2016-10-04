'use strict';

var assign = require('lodash/object/assign');

var domify     = require('min-dom/lib/domify'),
    domClasses = require('min-dom/lib/classes'),
    utils      = require('./utils');

var getSampleDate   = utils.getSampleDate,
    isDateCell      = utils.isDateCell,
    isISODateString = utils.isISODateString,
    parseDate       = utils.parseDate;

var getValue = function(input, fallback) {
  return input && input.value || fallback;
};

var setValue = function(input, value) {
  if (input) {
    input.value = value;
  }
};

function DateEdit(eventBus, simpleMode, elementRegistry, graphicsFactory, modeling, complexCell, selection) {
  this._eventBus = eventBus;
  this._simpleMode = simpleMode;
  this._elementRegistry = elementRegistry;
  this._graphicsFactory = graphicsFactory;
  this._modeling = modeling;
  this._complexCell = complexCell;
  this._selection = selection;

  var refreshHandler = function() {
    if (this._simpleMode.isActive()) {
      this.refresh();
    }
  };

  this._eventBus.on('simpleMode.activated', this.setupComplexCells, this);
  this._eventBus.on('simpleMode.deactivated', this.teardownComplexCells, this);
  this._eventBus.on('typeRow.editDataType', refreshHandler, this);
  this._eventBus.on('contentNode.created', refreshHandler, this);
  this._eventBus.on('element.changed', refreshHandler, this);

  // whenever an type cell is opened, we have to position the template, because the x offset changes
  // over time, when columns are added and deleted
  this._eventBus.on('complexCell.open', function(evt) {
    var config = evt.config;

    if (config.type === 'dateEdit') {
      var gfx = elementRegistry.getGraphics(config.element);
      var template = config.template;

      assign(template.parentNode.style, {
        left: (gfx.offsetLeft + gfx.offsetWidth - 10) + 'px'
      });

      var focusableNode = template.querySelector('input[type="text"]');
      if (focusableNode) {
        focusableNode.focus();
        focusableNode.select();
      }

      selection.select(config.element);
    }
  });

  this._eventBus.on('complexCell.close', function(complexCell) {
    var config = complexCell.config;
    if (config.type === 'dateEdit' && !config.isEmpty) {
      this.updateCellContent(config.element, {
        type: getValue(config.template.querySelector('.dateEdit-type-dropdown'), 'exact'),
        date1: getValue(config.template.querySelector('.date-1 input'), ''),
        date2: getValue(config.template.querySelector('.date-2 input'), '')
      });
    }
  }, this);

}

DateEdit.prototype.refresh = function() {
  this.teardownComplexCells();
  this.setupComplexCells();
};

DateEdit.prototype.setupComplexCells = function() {
  var graphicsFactory = this._graphicsFactory;
  var elementRegistry = this._elementRegistry;
  var complexCell = this._complexCell;

  elementRegistry.forEach(function(element) {
    if (isDateCell(element)) {
      var parsed = element.content && parseDate(element.content.text);

      if (element.content && element.content.text && !parsed) {
        // in this case, the date contains an expression, we should not show the date editor here

        // show nothing instead
        element.complex = {
          template: domify('<div>'),
          element: element,
          type: 'dateEdit',
          isEmpty: true,
          offset: {
            x: 0,
            y: 0
          }
        };

        graphicsFactory.update('cell', element, elementRegistry.getGraphics(element));
        return;
      }

      var node;
      if (element.column.type === 'dmn:InputClause') {
        node = domify(require('./template-input.html'));
      } else {
        node = domify(require('./template-output.html'));
      }

      // set the initial state based on the cell content
      setValue(node.querySelector('.dateEdit-type-dropdown'), parsed.type);
      setValue(node.querySelector('.date-1 input'), parsed.date1 || '');
      setValue(node.querySelector('.date-2 input'), parsed.date2 || '');

      if (parsed.date2 && node.querySelector('.date-2')) {
        node.querySelector('.date-2').style.display = 'block';
      }


      // wire the elements
      if (node.querySelector('.date-1 button') && node.querySelector('.date-1 input')) {
        node.querySelector('.date-1 button').addEventListener('click', function(evt) {
          node.querySelector('.date-1 input').value = getSampleDate();
        });
      }
      if (node.querySelector('.date-2 button') && node.querySelector('.date-2 input')) {
        node.querySelector('.date-2 button').addEventListener('click', function(evt) {
          node.querySelector('.date-2 input').value = getSampleDate(true);
        });
      }

      if (node.querySelector('.dateEdit-type-dropdown')) {
        node.querySelector('.dateEdit-type-dropdown').addEventListener('change', function(evt) {
          var type = evt.target.value;

          // update visibility of elements
          if (node.querySelector('.date-1')) {
            node.querySelector('.date-1').style.display = type === '' ? 'none' : 'block';
          }
          if (node.querySelector('.date-2')) {
            node.querySelector('.date-2').style.display = type === 'between' ? 'block' : 'none';
          }
        });
      }

      var closeFct = function(evt) {
        if (evt.keyCode === 13) {
          complexCell.close();
        }
      };

      var validateInput = function(evt) {
        var val = evt.target.value;
        var date = new Date(val);

        if (val === '' || isISODateString(val) && date.toString() !== 'Invalid Date') {
          // is valid
          domClasses(evt.target).remove('invalid');
        } else {
          // is invalid
          domClasses(evt.target).add('invalid');
        }

      };
      if (node.querySelector('.date-1 input')) {
        node.querySelector('.date-1 input').addEventListener('keydown', closeFct);
        node.querySelector('.date-1 input').addEventListener('input', validateInput);
      }

      if (node.querySelector('.date-2 input')) {
        node.querySelector('.date-2 input').addEventListener('keydown', closeFct);
        node.querySelector('.date-2 input').addEventListener('input', validateInput);
      }

      var complexCellConfig = {
        className: 'dmn-date-editor',
        template: node,
        element: element,
        type: 'dateEdit',
        offset: {
          x: 0,
          y: 0
        }
      };

      element.complex = complexCellConfig;

      graphicsFactory.update('cell', element, elementRegistry.getGraphics(element));
    }
  });
};

DateEdit.prototype.updateCellContent = function(element, data) {
  var type = data.type;
  var date1 = data.date1;
  var date2 = data.date2;

  // unset content
  if (date1.trim() === '') {
    return this._modeling.editCell(element.row.id, element.column.id, '');
  }

  // only apply valid entries
  if (type) {
    var date = new Date(date1);
    if (!isISODateString(date1) || date.toString() === 'Invalid Date') {
      return;
    }
    if (type === 'between') {
      date = new Date(date2);
      if (!isISODateString(date2) || date.toString() === 'Invalid Date') {
        return;
      }
    }
  }

  var content = '';
  switch (type) {
  case 'exact':
    content = 'date and time("' + date1 + '")';
    break;
  case 'before':
    content = '< date and time("' + date1 + '")';
    break;
  case 'after':
    content = '> date and time("' + date1 + '")';
    break;
  case 'between':
    content = '[date and time("' + date1 + '")..date and time("' + date2 + '")]';
    break;
  }
  this._modeling.editCell(element.row.id, element.column.id, content);
};

DateEdit.prototype.teardownComplexCells = function() {
  var graphicsFactory = this._graphicsFactory;
  var elementRegistry = this._elementRegistry;

  elementRegistry.forEach(function(element) {
    if (element.complex && element.complex.type === 'dateEdit') {

      delete element.complex;

      graphicsFactory.update('cell', element, elementRegistry.getGraphics(element));
    }
  });
};

DateEdit.$inject = [ 'eventBus', 'simpleMode', 'elementRegistry', 'graphicsFactory', 'modeling', 'complexCell', 'selection' ];

module.exports = DateEdit;
